import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { UseDisclosureReturn } from "@heroui/use-disclosure";
import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Input, Link, Textarea } from '@heroui/react';
import { property, PropertyValues } from '../../types';

interface TableDrawerProps {
    disclosure: UseDisclosureReturn
    title?: string;
    properties: Record<string, property>;
    initValue?: Record<string, property>;
}

const TableDrawer: React.FC<TableDrawerProps> = ({ disclosure, title, properties, initValue }) => {
    const handleProperty = (state: PropertyValues, newState: Partial<PropertyValues>): PropertyValues => ({ ...state, ...newState })
    const [state, dispatch] = useReducer(handleProperty, {} as PropertyValues)
    const { isOpen, onOpenChange } = disclosure;
    const inputs = useMemo(() => {
        let response: Record<string, React.JSX.Element> = {}
        if (initValue) response = Test1Component(initValue)
        else response = Test1Component(properties)
        return response
    }, [properties, initValue])

    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">{title}</h1>
                        </DrawerHeader>
                        <DrawerBody className="p-4">
                            {inputs ? Object.values(inputs) : null}
                        </DrawerBody>
                        <DrawerFooter className="flex justify-end">
                            <Link color='danger' onPress={onClose}>Cancel</Link>
                            <Button>Save</Button>
                        </DrawerFooter>
                    </>

                )}
            </DrawerContent>
        </Drawer>
    );
};


export default TableDrawer;

const handleTextChange = (value: property) => {
    const parents = getParents(value)
    console.log(parents)
}
const getParents = (parent?: property): string[] => {
    if (!parent) return []
    let response = getParents(parent.parent)
    response.push(parent.slug)
    return response
}
function Test1Component(properties: Record<string, property>): Record<string, React.JSX.Element> {
    let response: Record<string, React.JSX.Element> = {}
    let child: Record<string, React.JSX.Element> = {}, childElement: React.JSX.Element[] = []
    for (const [key, value] of Object.entries(properties)) {
        if (!value) return response
        switch (value.datatype) {
            case 'textField':
                response[key] = <Input key={key} label={value.name} defaultValue={value.value} onValueChange={_ => handleTextChange(value)} />
                break;
            case "multiline":
                response[key] = <Input key={key} label={value.name} defaultValue={value.value} onValueChange={_ => handleTextChange(value)} />
                break;
            case "url":
                response[key] = <Input key={key} label={value.name} defaultValue={value.value} onValueChange={_ => handleTextChange(value)} />
                break;
            case "map":
                if (value.properties) {
                    Object.entries(value.properties).map((entry, i) => {
                        const [inKey, inValue] = entry
                        inValue.parent = value
                        child[inKey] = Test1Component({ [inKey]: inValue })[inKey]
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
                                    <Input key={`elem-${index}`} value={inValue} onValueChange={_ => handleTextChange(value)} />
                                    :
                                    Object.entries(inValue).map((entry, i) => {
                                        const [inKey, inValue] = entry
                                        let entry2 = {...inValue, parent: { slug: `${index}`, name: "", datatype: "", parent: value }}
                                        return <div style={{ marginBottom: "10px" }} key={`prop-${i}`}>
                                            {Test1Component({ [inKey]: entry2 })[inKey]}
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

function MapComponent(props: { child?: React.JSX.Element | React.JSX.Element[], name: string }) {
    return (
        <Card>
            <CardHeader className="flex justify-between">{props.name}<p>map</p></CardHeader>
            <CardBody>
                {props.child}
            </CardBody>
        </Card>
    )
}

function ListComponent(props: { child?: React.JSX.Element | React.JSX.Element[], name: string }) {
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