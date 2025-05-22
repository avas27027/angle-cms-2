import { Accordion, AccordionItem, Card, CardBody, CardHeader, Input, Link } from "@heroui/react"
import { parsePropertyToValues, property, PropertyValues } from "../../types"
import { useEffect, useMemo, useState } from "react"
import { FaTrash } from "react-icons/fa"
import _, { set } from "lodash"

export function MapComponent(props: { child?: React.JSX.Element | React.JSX.Element[], name: string }) {
    return (
        <Card>
            <CardHeader className="flex justify-between">{props.name}<p>map</p></CardHeader>
            <CardBody>
                {props.child}
            </CardBody>
        </Card>
    )
}

export function ListComponent(props: { child?: React.JSX.Element | React.JSX.Element[], name: string }) {
    return (
        <Card>
            <CardHeader className="flex justify-between">{props.name}<p>list</p></CardHeader>
            <CardBody>
                <Accordion>
                    {props.child ? props.child : <AccordionItem title="No items"></AccordionItem>}
                </Accordion>
            </CardBody>
        </Card>
    )
}

export function inputsHook(properties: Record<string, property>): [Record<string, React.JSX.Element>, { path: string, value: string } | undefined] {
    const [response, setResponse] = useState<{ path: string, value: string } | undefined>()
    const [thisProperties, setThisProperties] = useState<Record<string, property>>({})
    useEffect(() => {setThisProperties(properties)}, [])
    const inputs = useMemo(() => { return FormComponent(thisProperties) }, [thisProperties])

    const getParents = (parent?: property): string[] => {
        if (!parent) return []
        let response = getParents(parent.parent)
        response.push(parent.slug)
        return response
    }

    const handleTextChange = (property: property, value: string) => {
        let path = ''
        let parents = getParents(property)
        parents.forEach((element, index) => {
            if (index === 0) path = element
            else path += `.${element}`
        });
        setResponse({ path, value })
    }

    const onDeleteArray = (property: property) => {
        let parents = getParents(property), path = ''
        parents.forEach((element, index) => {
            if (index === 0) path = element
            else path += `.${element}`
        });
        let response = _.omit(properties, path)
        setThisProperties(response)
        console.log("response", response)
    }
    function FormComponent(properties: Record<string, property>): Record<string, React.JSX.Element> {
        let response: Record<string, React.JSX.Element> = {}
        let child: Record<string, React.JSX.Element> = {}, childElement: React.JSX.Element[] = []
        for (const [key, value] of Object.entries(properties)) {
            if (!value) return response
            switch (value.datatype) {
                case 'textField':
                    response[key] = <Input key={key} label={value.name} defaultValue={value.value} onValueChange={val => handleTextChange(value, val)} />
                    break;
                case "multiline":
                    response[key] = <Input key={key} label={value.name} defaultValue={value.value} onValueChange={val => handleTextChange(value, val)} />
                    break;
                case "url":
                    response[key] = <Input key={key} label={value.name} defaultValue={value.value} onValueChange={val => handleTextChange(value, val)} />
                    break;
                case "map":
                    if (value.properties) {
                        Object.entries(value.properties).map((entry, i) => {
                            const [inKey, inValue] = entry
                            inValue.parent = value
                            child[inKey] = FormComponent({ [inKey]: inValue })[inKey]
                            if (child[inKey] !== undefined) {
                                childElement.push(<div style={{ marginBottom: "10px" }} key={`prop-${i}`}>{child[inKey]}</div>)
                            }
                        })
                    }
                    response[key] = <MapComponent key={key} name={value.name} child={childElement} />
                    break;
                case "list":
                    if (value.of?.value) {
                        value.of.value.forEach((inValue, index) => {
                            childElement.push(
                                <AccordionItem key={`accor${index}`} textValue={`${index}`}
                                    subtitle={<div className="flex justify-between"><p>{index + 1}</p><Link onPress={_ => onDeleteArray({ slug: `[${index}]`, name: "", datatype: "", parent: value })}><FaTrash /></Link></div>} >
                                    {typeof inValue === "string" ?
                                        <Input key={`elem-${index}`} value={inValue} onValueChange={val => handleTextChange(value, val)} />
                                        :
                                        Object.entries(inValue).map((entry, i) => {
                                            const [inKey, inValue] = entry
                                            let entry2 = { ...inValue, parent: { slug: `[${index}]`, name: "", datatype: "", parent: value } }
                                            return <div style={{ marginBottom: "10px" }} key={`prop-${i}`}>
                                                {FormComponent({ [inKey]: entry2 })[inKey]}

                                            </div>
                                        })
                                    }
                                </AccordionItem>
                            )
                        });

                    }
                    response[key] = <ListComponent key={key} name={value.name} child={childElement} />
                    break;
                default:
                    break;
            }
        }
        return response
    }

    return [inputs, response]
}
