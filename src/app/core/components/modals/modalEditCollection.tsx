import { useEffect, useState } from 'react'
import { Modal, ModalContent, Tab, Tabs } from '@heroui/react'
import EditProperties from '../../components/collection/editProperties'
import DetailsCollection from '../../components/collection/detailsCollection'
import {type UseDisclosureReturn } from "@heroui/use-disclosure";
import useSessionStorage from '../../../shared/hooks/useSessionStorage'
import type { Key } from '@react-types/shared';

const ModalEditCollection: React.FC<{ disclosure: UseDisclosureReturn, mode: 'properties' | 'details' | "", close: () => void }> = ({ disclosure, mode, close }) => {
    const [selected, setSelected] = useState<Key>('properties')
    const [propsEnable, setPropsEnable] = useState(true)
    const [_, setStorage] = useSessionStorage('newCollection')
    useEffect(() => {
        setSelected(mode)
        if (mode === 'details') setPropsEnable(true)
        else setPropsEnable(false)
    }, [mode])
    const detailCallback = (mode: Key,) => { setSelected(mode); setPropsEnable(false) }
    return (
        <section>
            <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange} size='5xl' onClose={() => { close(); setStorage({}) }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <Tabs aria-label="Options" selectedKey={selected} onSelectionChange={setSelected} destroyInactiveTabPanel={false}>
                                <Tab key={'details'} title='Details'>
                                    <DetailsCollection {...{ callback: detailCallback, close: onClose }} />
                                </Tab>
                                <Tab key={'properties'} title='Properties' isDisabled={propsEnable}>
                                    <EditProperties {...{ close: onClose }} />
                                </Tab>
                                <Tab key={'subcollections'} title='subcollections' isDisabled></Tab>
                            </Tabs>
                        </>)}
                </ModalContent>
            </Modal>
        </section >
    )
}
export default ModalEditCollection;

