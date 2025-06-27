import { Button, Input, Link, useDisclosure } from "@heroui/react"
import { useParams } from "react-router-dom"
import useSessionStorage from "../../../shared/hooks/useSessionStorage"
import { parsePropertyValues, property, PropertyValues, scheme } from "../../types"
import { useEffect, useMemo, useState } from "react"
import DefaultLayout from "../../layouts/default"
import { contentNew } from "../../config/site"
import { FaGear } from "react-icons/fa6"
import { FaTrash } from "react-icons/fa"
import TableDrawer from "../../components/drawers/tableDrawer"
import { useDispatchDocument } from "../../../shared/context/documentContext"
import { TableComponent } from "./tableComponent"
import { FormComponent } from "../../components/inputs/inputsComponents"
import _ from 'lodash';

export default function SchemeTable() {
    const { path } = useParams()
    const disclosure = useDisclosure()
    const [storage] = useSessionStorage("collections")
    const [storageValues, setStorageValues] = useSessionStorage("tableValues")
    const dispatch = useDispatchDocument()

    const collection = useMemo(() => {
        return (storage as scheme[]).filter((value) => { if (value.path === path) return value })[0]
    }, [path])

    const parseProperties = (values: PropertyValues[]) => {
        if (!values || !collection.properties || !Array.isArray(values)) return [];
        let responseParseProperties: Array<Record<string, property>> = [];
        values.forEach((value) => {
            responseParseProperties.push(parsePropertyValues(collection.properties!, value))
        })
        return responseParseProperties
    }

    const columns = useMemo(() => {
        const responseColumns: Array<{ key: string, label: string, property: property }> = []
        for (let key in collection.properties!) {
            responseColumns.push({ key: collection.properties[key].slug, label: collection.properties[key].name, property: collection.properties[key] })
        }
        return responseColumns
    }, [collection])

    const [rows, setRows] = useState<Array<Record<string, React.JSX.Element | string>>>([])
    const [filterValue, setFilterValue] = useState('')
    const [selectedKeys, setSelectedKeys] = useState<Array<string>>([])
    const dispatchContext = useDispatchDocument()

    useEffect(() => {
        let responseRows: Array<Record<string, React.JSX.Element | string>> = [];
        parseProperties(storageValues as PropertyValues[]).forEach((parsed) => {
            responseRows.push({ key: `${parsed.id.value}`, ...FormComponent(parsed) })
        })
        setRows(responseRows)
        setStorageValues(contentNew)
        dispatchContext({
            type: 'SCHEME',
            payload: collection.properties!
        })
    }, [])
    const handleSave = (values: PropertyValues | null) => {
        if (values) {
            let storage = (storageValues as PropertyValues[])
            if (values.id != null) {
                let responseRows: Array<Record<string, React.JSX.Element | string>> = [];
                let updateValues: PropertyValues[] = []
                storage.forEach((value => {
                    if (value.id === values.id) {
                        updateValues.push(values)
                    } else {
                        updateValues.push(value)
                    }
                }))
                console.log(updateValues)
                setStorageValues(updateValues)
                parseProperties(updateValues).forEach((parsed) => {
                    responseRows.push({ key: `${parsed.id.value}`, ...FormComponent(parsed) })
                })
                console.log(responseRows)
                setRows(responseRows)
            }
            else {
                values.id = _.uniqueId('id_')
                storage.push(values)
                let responseRows: Array<Record<string, React.JSX.Element | string>> = [];
                parseProperties(storage).forEach((parsed) => {
                    responseRows.push({ key: `${parsed.id.value}`, ...FormComponent(parsed) })
                })
                setRows(responseRows)
                setStorageValues(storage)
            }
        }
    }

    const handleOnSelectionChange = (e: Set<string>) => {
        const array = Array.from(e)
        setSelectedKeys(array)
        if (array.length > 0) {
            let key = array[array.length - 1]
            let selectedValue = (storageValues as PropertyValues[]).find((value) => value.id === key)
            dispatchContext({
                type: 'VALUES',
                payload: selectedValue || {}
            })
        }
    }

    const handleOnDelete = () => {
        if (selectedKeys.length === 0 || !storageValues) return;
        let response = rows.filter((value) => !selectedKeys.includes(`${value.key}`))
        setRows(response)
        let newValues = (storageValues as PropertyValues[]).filter((value) => !selectedKeys.includes(`${value.id}`))
        setStorageValues(newValues)
    }

    const handleOnAdd = () => {
        dispatch({
            type: 'VALUES',
            payload: {}
        })
        disclosure.onOpen()

    }

    return (
        <DefaultLayout title="Belleza y Salud">
            <section>
                <header className="flex justify-between p-4">
                    <h2>{collection.name}</h2>
                    <div className="flex gap-4">
                        <Input placeholder="Search..." value={filterValue} onValueChange={setFilterValue} />
                        <div className="flex gap-2">
                            <Link isDisabled={selectedKeys.length === 0} onPress={disclosure.onOpen}><FaGear /></Link>
                            <Link isDisabled={selectedKeys.length === 0} onPress={handleOnDelete}><FaTrash /></Link>
                            <Button onPress={handleOnAdd} fullWidth>+ Add {collection.name}</Button>
                        </div>
                    </div>
                </header>
                {
                    collection.properties && parseProperties.length > 0 ?
                        <TableComponent
                            columns={columns}
                            rows={rows}
                            parseProperties={parseProperties(storageValues as PropertyValues[])}
                            onSelectionChange={handleOnSelectionChange}
                            filterValue={filterValue}
                        />
                        : <p className="text-center p-4">No properties defined for this collection</p>
                }
            </section>
            {
                collection.properties && parseProperties.length > 0 ?
                    <TableDrawer {...{ disclosure, title: collection.name, onSave: handleSave }} />
                    : null
            }
        </DefaultLayout>
    );
}