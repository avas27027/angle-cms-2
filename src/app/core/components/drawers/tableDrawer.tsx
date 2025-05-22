import React, { useEffect, useReducer } from 'react';
import { UseDisclosureReturn } from "@heroui/use-disclosure";
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Input, Link } from '@heroui/react';
import { property, PropertyValues } from '../../types';
import { inputsHook} from '../inputs/inputsComponents';

interface TableDrawerProps {
    disclosure: UseDisclosureReturn
    title?: string;
    initValue: Record<string, property>;
}

const TableDrawer: React.FC<TableDrawerProps> = ({ disclosure, title, initValue }) => {
    const handleProperty = (state: PropertyValues, newState: Partial<PropertyValues>): PropertyValues => ({ ...state, ...newState })
    const [state, dispatch] = useReducer(handleProperty, {} as PropertyValues)
    const { isOpen, onOpenChange } = disclosure;
    const [inputs, response] = inputsHook({...initValue})
    useEffect(() => {
        console.log("state", initValue)
        console.log("response", response)
    }, [response])

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


const addToObject = (response: PropertyValues, parents: string[]): PropertyValues | PropertyValues[] => {
    if (parents.length <= 1) return {}
    // Set the last element as the value
    if (parents.length === 2) { response[parents[1]] = parents[0]; return response }
    let current = parents.pop()!
    let next = parents[parents.length - 1]
    // Check if is a list, because the next element is a number
    if (!isNaN(Number(next)) && !isNaN(parseFloat(next))) {
        (response[current] as PropertyValues[])[Number(next)] = (addToObject({ ...response[current] as PropertyValues }, parents) as PropertyValues)[next] as PropertyValues
    }
    else response[current] = { ...response[current] as PropertyValues, ...addToObject({ ...response[current] as PropertyValues }, parents) }
    return response
}