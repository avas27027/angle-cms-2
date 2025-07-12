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

export const parseProperties = (values: PropertyValues[], scheme: Record<string, property>) => {
    if (!values || !scheme || !Array.isArray(values)) return [];
    let responseParseProperties: Array<Record<string, property>> = [];
    values.forEach((value) => {
        responseParseProperties.push(parsePropertyValues(scheme, value))
    })
    return responseParseProperties
}
const defineColumns = (properties: Record<string, property>) => {
    let responseColumns: Array<{ key: string, label: string, property: property }> = [];
    for (let key in properties) {
        responseColumns.push({ key: properties[key].slug, label: properties[key].name, property: properties[key] })
    }
    return responseColumns
}
export default function SchemeTable() {
    const { path } = useParams()
    const disclosure = useDisclosure()
    const [storage] = useSessionStorage("collections")
    const [storageValues, setStorageValues] = useSessionStorage("tableValues")
    const [rows, setRows] = useState<Array<Record<string, React.JSX.Element | string>>>([])
    const [filterValue, setFilterValue] = useState('')
    const [selectedKeys, setSelectedKeys] = useState<Array<string>>([])
    const dispatchContext = useDispatchDocument()
    const collection = (storage as scheme[]).filter((value) => { if (value.path === path) return value })[0]

    useEffect(() => {
        let responseRows: Array<Record<string, React.JSX.Element | string>> = [];
        parseProperties(storageValues as PropertyValues[], collection.properties!).forEach((parsed) => {
            responseRows.push({ key: `${parsed.id.value}`, ...FormComponent(parsed) })
        })
        setRows(responseRows)
        setStorageValues(contentNew)
        dispatchContext({ type: 'SCHEME', payload: collection.properties! })
    }, [])
    const handleSave = (values: PropertyValues) => {
        let storage = (storageValues as PropertyValues[]), responseRows: Array<Record<string, React.JSX.Element | string>> = [];
        let position = storage.findIndex((value) => value.id === values.id)
        if (position === -1) storage.push(values)
        else storage[position] = values
        parseProperties(storage, collection.properties!).forEach((parsed) => {
            responseRows.push({ key: `${parsed.id.value}`, ...FormComponent(parsed) })
        })
        setStorageValues(storage)
        setRows(responseRows)
    }

    const handleOnSelectionChange = (e: Set<string>) => {
        const array = Array.from(e)
        setSelectedKeys(array)
        if (array.length > 0) {
            let key = array[array.length - 1]
            let selectedValue = (storageValues as PropertyValues[]).find((value) => value.id === key)
            dispatchContext({ type: 'VALUES', payload: selectedValue || {} })
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
        dispatchContext({ type: 'VALUES', payload: {} })
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
                            columns={defineColumns(collection.properties!)}
                            rows={rows}
                            parseProperties={parseProperties(storageValues as PropertyValues[], collection.properties!)}
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