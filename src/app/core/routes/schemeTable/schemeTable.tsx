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
import { FormComponent } from "../../components/inputs/inputsComponents"
import { TableComponent } from "./tableComponent"

export default function SchemeTable() {
    const { path } = useParams()
    const disclosure = useDisclosure()
    const [storage, _] = useSessionStorage("collections")
    const [storageValues, setStorageValues] = useSessionStorage("tableValues")

    const collection = useMemo(() => {
        return (storage as scheme[]).filter((value) => { if (value.path === path) return value })[0]
    }, [path])

    const columns = useMemo(() => {
        const responseColumns: Array<{ key: string, label: string, property: property }> = []
        for (let key in collection.properties!) {
            responseColumns.push({ key: collection.properties[key].slug, label: collection.properties[key].name, property: collection.properties[key] })
        }
        return responseColumns
    }, [collection])

    const parseProperties = useMemo(() => {
        let responseParseProperties: Array<Record<string, property>> = [];
        (storageValues as PropertyValues[]).forEach((value) => {
            responseParseProperties.push(parsePropertyValues(collection.properties!, value))
        })
        return responseParseProperties
    }, [collection, storageValues])

    const rows = useMemo(() => {
        let responseRows: Array<Record<string, React.JSX.Element | string>> = [];
        parseProperties.forEach((parsed, i) => { responseRows.push({ key: `${i}`, ...FormComponent(parsed) }) })
        return responseRows
    }, [parseProperties])

    const [filterValue, setFilterValue] = useState('')
    const [selectedKeys, setSelectedKeys] = useState<Array<string>>([])
    const dispatchContext = useDispatchDocument()

    useEffect(() => {
        setStorageValues(contentNew)
        dispatchContext({
            type: 'SCHEME',
            payload: collection.properties!
        })
    }, [])

    const handleOnSelectionChange = (e: Set<string>) => {
        const array = Array.from(e)
        setSelectedKeys(array)
        if (array.length > 0) {
            let key = array[array.length - 1]
            dispatchContext({
                type: 'VALUES',
                payload: (storageValues as PropertyValues[])[Number(key)]
            })
        }
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
                            <Link isDisabled={selectedKeys.length === 0}><FaTrash /></Link>
                            <Button fullWidth>+ Add {collection.name}</Button>
                        </div>
                    </div>
                </header>
                {columns.length > 0 ?
                    <TableComponent
                        columns={columns}
                        filterValue={filterValue}
                        rows={rows}
                        parseProperties={parseProperties}
                        onSelectionChange={handleOnSelectionChange} />
                    :
                    null
                }
            </section>
            {
                collection.properties ?
                    <TableDrawer {...{ disclosure, title: collection.name }} />
                    : null
            }
        </DefaultLayout>
    );
}