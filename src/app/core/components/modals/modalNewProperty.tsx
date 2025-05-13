import { fields } from "../../config/site";
import { type property } from "../../types";
import { Button, Card, CardBody, CardHeader, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@heroui/react";
import { useEffect, useReducer } from "react";
import { BsFillCollectionFill } from "react-icons/bs";
import { slugify } from "../../../shared/Utils";
import { FaTrash } from "react-icons/fa";

const ModalNewProperty: React.FC<{ mode: string, callback: (mode: string, property: property) => void, initProperty?: property }> =
    ({ mode, callback, initProperty }) => {
        const { isOpen, onOpenChange, onOpen } = useDisclosure()
        useEffect(() => { onOpen() }, [])
        useEffect(() => { dispatch(initProperty!) }, [initProperty])

        const handleProperty = (state: property, newState: Partial<property>): property => ({ ...state, ...newState })
        const [state, dispatch] = useReducer(handleProperty, initProperty ? initProperty : { name: '', slug: '', description: '', url: '', datatype: 'textField', properties: {}, parent: undefined })
        const setSlug = (value: string) => { if (mode === 'create') return { slug: slugify(value) } }
        return (
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={() => { callback('close', state) }}>
                <ModalContent>
                    {(_) => (
                        <div>
                            <ModalHeader>
                                <BsFillCollectionFill />
                                <Select label={'Field'} selectedKeys={[state.datatype]} onChange={e => dispatch({ datatype: e.target.value })}>
                                    {fields.map((item) => <SelectItem key={item.value}>{item.name}</SelectItem>)}
                                </Select>
                            </ModalHeader>
                            <ModalBody>
                                {state.parent?.datatype != 'list' ?
                                    <div>
                                        <Input label='Field name' value={state.name} onValueChange={value => { dispatch({ name: value, ...setSlug(value) }) }} />
                                        <Input label='ID' disabled value={state.slug} />
                                        <Input label='Description' value={state.description} onValueChange={value => dispatch({ description: value })} />
                                    </div> : ''
                                }
                                {state.datatype === 'url' ?
                                    <Select label={'Url'} selectedKeys={[state.url!]} onChange={e => dispatch({ url: e.target.value })}>
                                        {[{ name: 'true', value: '' },
                                        { name: 'Image', value: 'image' },
                                        { name: 'Video', value: 'video' }].map((item) => <SelectItem key={item.value}>{item.name}</SelectItem>)}
                                    </Select> : ''
                                }
                                {state.datatype === 'map' ?
                                    <div className="">
                                        <header className="flex justify-between">
                                            <h2>Properties in this group</h2>
                                            <Button isDisabled={state.slug === '' && state.parent?.datatype != 'list'}
                                                onPress={() => { callback('create', state) }}>+ Add Property</Button>
                                        </header>

                                        <div className="">
                                            {state.properties ? Object.values(state.properties).map((e, i) => {
                                                e.parent = state
                                                return (
                                                    <div key={`property-${i}`}>
                                                        <BsFillCollectionFill />
                                                        <Card isPressable onPress={() => { callback('edit', e); console.log(e) }}>
                                                            <CardHeader>
                                                                <h3>{e.name}</h3>
                                                                <Link onPress={() => {
                                                                    let newProps = state.properties!
                                                                    delete newProps[e.slug]
                                                                    dispatch({ properties: newProps })
                                                                }}><FaTrash /></Link>
                                                            </CardHeader>
                                                            <CardBody>
                                                                <p>{e.datatype}</p>
                                                            </CardBody>
                                                        </Card>
                                                    </div>
                                                )
                                            }) : ''}
                                        </div>
                                    </div> : ''
                                }
                                {state.datatype === 'list' ?
                                    <div>{state.of ?
                                        <div>
                                            <BsFillCollectionFill />
                                            <Card isPressable onPress={() => {
                                                callback('edit', { name: '', slug: '', parent: state, datatype: state.of!.datatype, ...state.of, value: undefined })
                                            }}>
                                                <CardHeader><h3>{state.of.datatype}</h3></CardHeader>
                                            </Card>
                                        </div>
                                        : <Button fullWidth onPress={() => { callback('create', state) }} isDisabled={state.slug === ''}>+ Add List</Button>}</div>
                                    : ''}
                            </ModalBody>
                            <ModalFooter>
                                <Button fullWidth isDisabled={(state.datatype === '' || state.slug === '') && state.parent?.datatype != 'list'} onPress={() => { callback('response', state) }}>+ Update property</Button>
                            </ModalFooter>
                        </div>
                    )}
                </ModalContent>
            </Modal>

        )
    }
export default ModalNewProperty;