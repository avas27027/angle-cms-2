import { Accordion, AccordionItem, Card, CardBody, CardHeader, Input } from "@heroui/react"
import { parsePropertyToValues, property, PropertyValues } from "../../types"
import { useEffect, useState } from "react"

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

export function inputsComponents(properties: Record<string, property>) {
    const [response, setResponse] = useState<{ property: property, value: string } | undefined>()
    const [inputs, setInputs] = useState({} as Record<string, React.JSX.Element>)

    const getParents = (parent?: property): string[] => {
        if (!parent) return []
        let response = getParents(parent.parent)
        response.push(parent.slug)
        return response
    }

    const handleTextChange = (property: property, value: string) => {
        setResponse({ property, value })
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
                                <AccordionItem key={`accor${index}`} subtitle={index + 1} textValue={`${index}`}>
                                    {typeof inValue === "string" ?
                                        <Input key={`elem-${index}`} value={inValue} onValueChange={val => handleTextChange(value, val)} />
                                        :
                                        Object.entries(inValue).map((entry, i) => {
                                            const [inKey, inValue] = entry
                                            let entry2 = { ...inValue, parent: { slug: `${index}`, name: "", datatype: "", parent: value } }
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
