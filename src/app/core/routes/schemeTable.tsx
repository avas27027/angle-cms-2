import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, getKeyValue, Input, Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea, useDisclosure } from "@heroui/react"
import { useParams } from "react-router-dom"
import useSessionStorage from "../../shared/hooks/useSessionStorage"
import { parsePropertyValues, property, PropertyValues, scheme } from "../types"
import { useEffect, useMemo, useState } from "react"
import DefaultLayout from "../layouts/default"
import { contentNew } from "../config/site"
import { FaGear } from "react-icons/fa6"
import { FaTrash } from "react-icons/fa"
import TableDrawer from "../components/drawers/tableDrawer"
import { useDispatchDocument, useDocument } from "../../shared/context/documentContext"

export default function SchemeTable() {
    const { path } = useParams()
    const [storage, _] = useSessionStorage("collections")
    const disclosure = useDisclosure()
    const name = useMemo(() => { return (storage as scheme[]).filter((value) => { if (value.path === path) return value })[0].name }, [path])
    const properties = useMemo(() => {
        return (storage as scheme[]).filter((value) => { if (value.path === path) return value })[0].properties!
    }, [path])

    const [parseProperties, setParseProperties] = useState<Array<Record<string, property>>>([])
    const [columns, setColumns] = useState<Array<{ key: string, label: string, property: property }>>([])
    const [rows, setRows] = useState<Array<Record<string, React.JSX.Element | string>>>([])

    const [filterValue, setFilterValue] = useState('')
    const [selectedKeys, setSelectedKeys] = useState<Array<string>>([])
    const dispatchContext = useDispatchDocument()

    const handleOnSelectionChange = (e: Set<string>) => {
        const array = Array.from(e)
        setSelectedKeys(array)
        if (array.length > 0) {
            let key = array[array.length - 1]
            dispatchContext({
                type: 'VALUES',
                payload: contentNew[Number(key)]
            })
        }
    }

    useEffect(() => {
        dispatchContext({
            type: 'SCHEME',
            payload: properties
        })
        // Set the columns for the table
        const responseColumns: Array<{ key: string, label: string, property: property }> = []
        for (let key in properties) {
            responseColumns.push({ key: properties[key].slug, label: properties[key].name, property: properties[key] })
        }
        setColumns(responseColumns)

        // Set the rows for the table
        if (properties) {
            let responseRows: Array<Record<string, React.JSX.Element | string>> = []
            let responseParseProperties: Array<Record<string, property>> = []

            //Se tipean los valores traidos por firebase ContentNew
            contentNew.forEach((value, i) => {
                let parsed = parsePropertyValues(properties, value)
                responseParseProperties.push(parsed)
                responseRows.push({ key: `${i}`, ...rowHandler(parsed) })
            })
            setRows(responseRows)
            setParseProperties(responseParseProperties)
        }
    }, [])

    const filteredItems = useMemo(() => {
        let filtered = [...rows]
        let values = parseProperties.map((value) => {
            return Object.values(value).map((entry) => {
                if (entry.value && typeof entry.value === 'string')
                    return entry.value.toLocaleLowerCase().includes(filterValue.toLowerCase())
                else return false
            }).reduce((a, b) => {
                if (a || b) return true
                return false
            })
        })
        return filtered = filtered.filter((_, i) => values[i])
    }, [filterValue, parseProperties, rows])

    return (
        <DefaultLayout title="Belleza y Salud">
            <section>
                <header className="flex justify-between p-4">
                    <h2>{name}</h2>
                    <div className="flex gap-4">
                        <Input placeholder="Search..." value={filterValue} onValueChange={setFilterValue} />
                        <div className="flex gap-2">
                            <Link onPress={disclosure.onOpen}><FaGear /></Link>
                            <Link><FaTrash /></Link>
                            <Button fullWidth>+ Add {name}</Button>
                        </div>
                    </div>
                </header>
                {columns.length > 0 ?
                    <Table aria-label="Example static collection table" selectionMode="multiple" selectedKeys={selectedKeys} onSelectionChange={value => handleOnSelectionChange(value as Set<string>)}>
                        <TableHeader columns={columns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody items={filteredItems}>
                            {(item) => (
                                <TableRow key={(item.key as string)}>
                                    {(columnKey) => {
                                        return <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                                    }}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table> : ""
                }
            </section>
            {
                properties ?
                    <TableDrawer {...{ disclosure, name }} />
                    : null
            }
        </DefaultLayout>
    );
}

// This function takes an object with property values and returns a new object with the same keys but with JSX elements as values
export const rowHandler = (values: Record<string, property>): Record<string, React.JSX.Element> => {
    let response: Record<string, React.JSX.Element> = {}
    for (const [key, value] of Object.entries(values)) {
        switch (value.datatype) {
            case 'textField':
                response[key] = <Input key={key} isDisabled label={value.name} value={value.value} />
                break;
            case "multiline":
                response[key] = <Textarea key={key} isDisabled label={value.name} value={value.value} />
                break;
            case "url":
                response[key] = <Input key={key} isDisabled label={value.name} value={value.value} />
                break;
            case "map":
                response[key] =
                    <Card key={key}>
                        <CardHeader className="flex justify-between">{value.name}<p>map</p></CardHeader>
                        <CardBody>
                            {value.properties ?
                                Object.entries(value.properties).map((entry, i) => {
                                    const [inKey, inValue] = entry
                                    return <div style={{ marginBottom: "10px" }} key={`prop-${i}`}>{rowHandler({ [inKey]: inValue })[inKey]}</div>
                                })
                                : ''
                            }
                        </CardBody>
                    </Card>
                break;
            case "list":
                response[key] =
                    <Card>
                        <CardHeader className="flex justify-between">{value.name}<p>list</p></CardHeader>
                        <CardBody>
                            {value.of?.value ?
                                <Accordion>
                                    {value.of!.value!.map((inValue, i) =>
                                        <AccordionItem key={`accor${i}`} subtitle={i + 1} textValue={`${i}`}>
                                            {typeof inValue === "string" ?
                                                <Input isDisabled key={`elem-${i}`} value={inValue} />
                                                :
                                                Object.entries(inValue).map((entry, i) => {
                                                    const [inKey, inValue] = entry
                                                    return <div style={{ marginBottom: "10px" }} key={`prop-${i}`}>
                                                        {rowHandler({ [inKey]: inValue })[inKey]}
                                                    </div>
                                                })
                                            }
                                        </AccordionItem>
                                    )}
                                </Accordion>
                                : ''
                            }
                        </CardBody>
                    </Card>
                break;
            default:
                break;
        }
    }
    return response
}