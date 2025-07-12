import { UseDisclosureReturn } from "@heroui/use-disclosure";
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Link } from '@heroui/react';
import { parsePropertyValues, property, PropertyValues } from '../../types';
import { FormComponent } from '../inputs/inputsComponents';
import _ from 'lodash';
import { useDispatchDocument, useDocument } from '../../../shared/context/documentContext';
import { useState } from "react";

interface TableDrawerProps {
    disclosure: UseDisclosureReturn
    title?: string;
    onSave: (values: PropertyValues) => void;
}

/**
 * TableDrawer is a React functional component that renders a drawer interface for editing table-like data structures.
 * 
 * @param {TableDrawerProps} props - The props for the TableDrawer component.
 * @param {Disclosure} props.disclosure - Controls the open/close state of the drawer.
 * @param {string} props.title - The title displayed at the top of the drawer.
 * @param {(response: PropertyValues | null) => void} props.onSave - Callback invoked when the user saves changes.
 * 
 * @remarks
 * - Integrates with a document context to read and update values.
 * - Supports adding, editing, and deleting array items within the table structure.
 * - Uses utility functions to manage nested property paths.
 * - Renders form components dynamically based on the provided schema and current values.
 * 
 * @returns {JSX.Element} The rendered drawer component.
 */
const TableDrawer: React.FC<TableDrawerProps> = ({ disclosure, title, onSave }) => {
    const { isOpen, onOpenChange } = disclosure;
    const context = useDocument()
    const dispatch = useDispatchDocument()
    const [response, setResponse] = useState<PropertyValues | null>(null)

    const getParents = (parent?: property): string[] => {
        if (!parent) return []
        let response = getParents(parent.parent)
        response.push(parent.slug)
        return response
    }

    const handleOnSave = (onClose: () => void) => {
        if (response) {
            if (response.id == null) response.id = _.uniqueId('id_')
            onSave(response)
            onClose()
        }
    }

    const onDeleteArray = (property: property) => {
        let parents = getParents(property), path = ''
        let index = _.parseInt(_.trim(parents[parents.length - 1], '[]'))
        parents.pop() // Remove the last element if it is an array index
        parents.forEach((element, index) => {
            if (index === 0) path = element
            else path += `.${element}`
        });
        let target = _.get(context.value, path)
        if (Array.isArray(target)) target = _.remove(target, (_, i) => i !== index)
        let response = _.set(context.value, path, target)
        dispatch({
            type: 'VALUES',
            payload: response
        })
    }

    // This function is used to handle text changes in input fields
    const handleTextChange = (property: property, value: string) => {
        let parents = getParents(property), path = ''
        parents.forEach((element, index) => {
            if (index === 0) path = element
            else path += `.${element}`
        });
        let response = _.set(context.value, path, value)
        setResponse(response)
    }

    // This function is used to add a new item to an array property
    const onAddArray = (property: property) => {
        let parents = getParents(property), path = ''
        parents.forEach((element, index) => {
            if (index === 0) path = element
            else path += `.${element}`
        });
        let target = _.get(context.value, path) as PropertyValues[] || []
        let newValue: PropertyValues = {}
        Object.keys(property.of?.properties || {}).forEach((key) => {
            newValue[key] = ''
        })
        target.push(newValue)
        let response = _.set(context.value, path, target)
        dispatch({ type: 'VALUES', payload: response })
    }
    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">{title}</h1>
                        </DrawerHeader>
                        <DrawerBody className="p-4">
                            {Object.values(FormComponent(parsePropertyValues(context.scheme, Object.keys(context.value).length > 0 ? context.value : {}), true, handleTextChange, onDeleteArray, onAddArray))}
                        </DrawerBody>
                        <DrawerFooter className="flex justify-end">
                            <Link color='danger' onPress={onClose}>Cancel</Link>
                            <Button onPress={_ => { handleOnSave(onClose) }}>Save</Button>
                        </DrawerFooter>
                    </>

                )}
            </DrawerContent>
        </Drawer>
    );
};


export default TableDrawer;