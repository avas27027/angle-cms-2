import React, { useEffect, useReducer } from 'react';
import { UseDisclosureReturn } from "@heroui/use-disclosure";
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Input, Link } from '@heroui/react';
import { parsePropertyValues, property, PropertyValues } from '../../types';
import { InputsComponents } from '../inputs/inputsComponents';
import _ from 'lodash';
import { useDispatchDocument, useDocument } from '../../../shared/context/documentContext';

interface TableDrawerProps {
    disclosure: UseDisclosureReturn
    title?: string;
}

const TableDrawer: React.FC<TableDrawerProps> = ({ disclosure, title }) => {
    const { isOpen, onOpenChange } = disclosure;
    const context = useDocument()
    const dispatch = useDispatchDocument()

    const getParents = (parent?: property): string[] => {
        if (!parent) return []
        let response = getParents(parent.parent)
        response.push(parent.slug)
        return response
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

    const handleTextChange = (property: property, value: string) => {
        let parents = getParents(property), path = ''
        parents.forEach((element, index) => {
            if (index === 0) path = element
            else path += `.${element}`
        });
        let response = _.set(context.value, path, value)
        console.log(response)
    }

    const onAddArray = (property: property) => {
        let parents = getParents(property), path = ''
        parents.forEach((element, index) => {
            if (index === 0) path = element
            else path += `.${element}`
        });
        let target = _.get(context.value, path) as PropertyValues[]
        let newValue: PropertyValues = {}
        Object.keys(property.of?.properties || {}).forEach((key) => {
            newValue[key] = ''
        })
        target.push(newValue)
        let response = _.set(context.value, path, target)
        dispatch({
            type: 'VALUES',
            payload: response
        })
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
                            <InputsComponents onChange={handleTextChange}
                                onDeleteList={onDeleteArray}
                                onAdd={onAddArray}
                                editable />
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