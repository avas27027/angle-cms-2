import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Input, Link } from "@heroui/react"
import { parsePropertyValues, property } from "../../types"
import { FaTrash } from "react-icons/fa"
import _ from "lodash"
import { useDocument } from "../../../shared/context/documentContext"
import { useMemo } from "react"

type MapComponentProps = {
    name: string,
    property: property,
    MapComponent: (properties: Record<string, property>) => Record<string, React.JSX.Element>
}
export const MapComponent: React.FC<MapComponentProps> = ({ MapComponent, name, property }) => {
    const childs = useMemo(() => {
        let child: Record<string, React.JSX.Element> = {}
        let childElement: React.JSX.Element[] = []
        Object.entries(property.properties!).map((entry, i) => {
            const [inKey, inValue] = entry
            inValue.parent = property
            child[inKey] = MapComponent({ [inKey]: inValue })[inKey]
            if (child[inKey] !== undefined) {
                childElement.push(<div style={{ marginBottom: "10px" }} key={`prop-${i}`}>{child[inKey]}</div>)
            }
        })
        return childElement
    }, [property])

    return (
        <Card>
            <CardHeader className="flex justify-between">{name}<p>map</p></CardHeader>
            <CardBody>
                {childs}
            </CardBody>
        </Card>
    )
}
type LisComponentType = {
    name: string,
    property: property,
    MapComponent: (properties: Record<string, property>) => Record<string, React.JSX.Element>,
    onDelete?: (property: property) => void,
    onChange?: (property: property, value: string) => void,
    onAdd?: (property:property) => void,
    editable?: boolean
}
export const ListComponent: React.FC<LisComponentType> = ({ name, property, onChange, onDelete, onAdd, MapComponent, editable }) => {
    const childs = useMemo(() => {
        let childElement: React.JSX.Element[] = []
        if (property.of?.value === undefined) return childElement
        property.of.value.forEach((inValue, index) => {
            childElement.push(
                <AccordionItem key={`accor${index}`} textValue={`${index}`}
                    subtitle={
                        <div className="flex justify-between">
                            <p>{index + 1}</p>
                            <Link className={editable ? '' : 'hidden'}
                                onPress={onDelete ? (_ => onDelete({ slug: `[${index}]`, name: "", datatype: "", parent: property })) : undefined}>
                                <FaTrash />
                            </Link>
                        </div>} >
                    {typeof inValue === "string" ?
                        <Input isDisabled={!editable} key={`elem-${index}`} value={inValue} onValueChange={onChange ? (val => onChange(property, val)) : undefined} />
                        :
                        Object.entries(inValue).map((entry, i) => {
                            const [inKey, inValue] = entry
                            let entry2 = { ...inValue, parent: { slug: `[${index}]`, name: "", datatype: "", parent: property } }
                            return <div style={{ marginBottom: "10px" }} key={`prop-${i}`}>
                                {MapComponent({ [inKey]: entry2 })[inKey]}

                            </div>
                        })
                    }
                </AccordionItem>
            )
        })
        return childElement
    }, [property])
    return (
        <Card>
            <CardHeader className="flex justify-between">{name}<p>list</p></CardHeader>
            <CardBody>
                <Accordion>
                    {property.of?.value && property.of.value.length > 0 ?
                        childs : <AccordionItem title="No items"></AccordionItem>
                    }
                </Accordion>
                <Button onPress={onAdd ? (_ => onAdd(property)) : undefined} className={editable ? '' : 'hidden'}>+ Add element</Button>
            </CardBody>
        </Card>
    )
}

type InputsComponentsProps = {
    onDeleteList?: (property: property) => void,
    onChange?: (property: property, value: string) => void,
    onAdd?: (property: property) => void,
    editable?: boolean
}
export const InputsComponents: React.FC<InputsComponentsProps> = ({ onDeleteList, onChange, onAdd, editable }) => {
    const context = useDocument()

    function FormComponent(properties: Record<string, property>): Record<string, React.JSX.Element> {
        let response: Record<string, React.JSX.Element> = {}
        for (const [key, value] of Object.entries(properties)) {
            if (!value) return response
            switch (value.datatype) {
                case 'textField':
                    response[key] =
                        <Input key={key}
                            label={value.name}
                            defaultValue={value.value}
                            onValueChange={onChange ? (val => onChange(value, val)) : undefined}
                            isDisabled={!editable} />
                    break;
                case "multiline":
                    response[key] =
                        <Input key={key}
                            label={value.name}
                            defaultValue={value.value}
                            onValueChange={onChange ? (val => onChange(value, val)) : undefined} 
                            isDisabled={!editable} />
                    break;
                case "url":
                    response[key] =
                        <Input key={key}
                            label={value.name}
                            defaultValue={value.value}
                            onValueChange={onChange ? (val => onChange(value, val)) : undefined} 
                            isDisabled={!editable} />
                    break;
                case "map":
                    response[key] =
                        <MapComponent key={key}
                            name={value.name}
                            property={{ ...value }}
                            MapComponent={FormComponent} />
                    break;
                case "list":
                    response[key] =
                        <ListComponent key={key}
                            name={value.name}
                            property={{ ...value }}
                            MapComponent={FormComponent}
                            onChange={onChange}
                            onDelete={onDeleteList}
                            onAdd={onAdd}
                            editable={editable} />
                    break;
                default:
                    break;
            }
        }
        return response
    }
    return (
        <div>{Object.values(FormComponent(parsePropertyValues(context.scheme, context.value)))}</div>
    )
}
