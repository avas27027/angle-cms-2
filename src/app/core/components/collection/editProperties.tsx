import { Button } from "@heroui/button"
import { Card, CardBody, CardHeader, Input, Link } from "@heroui/react"
import { BsFillCollectionFill } from "react-icons/bs"
import { FaTrash } from "react-icons/fa"
import { useState } from "react"
import { type property, type scheme } from "../../types"
import './editProperties.scss';
import { FaGear } from "react-icons/fa6"
import ModalNewProperty from "../modals/modalNewProperty"
import useSessionStorage from "../../../shared/hooks/useSessionStorage"
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import firebase from "../../config/firebase"

export type ModalType = { mode: string, callback: (mode: string, property: property) => void, initProperty?: property }
function deleteKey(property: property) {
    delete property.parent
    if (property.properties) {
        for (const [_, value] of Object.entries(property.properties)) {
            if (value.properties || value.of?.properties) deleteKey(value)
            delete value.parent
        }
    }
    if (property.of?.properties) {
        for (const [_, value] of Object.entries(property.of.properties)) {
            if (value.properties || value.of?.properties) deleteKey(value)
            delete value.parent
        }
    }
    else return property
}

const EditProperties: React.FC<{ close: () => void }> = ({ close }) => {
    const [storage, setStorage] = useSessionStorage('newCollection')
    const [storageCollections, setStorageCollections] = useSessionStorage('collections')
    const newCollection: scheme = storage ? storage as scheme : { name: 'Collection Name', path: 'collectionName', description: "", icon: "" }

    const [selectProperty, setSelectProperty] = useState<property>()
    const [properties, setProperties] = useState<Record<string, property> | undefined>(newCollection.properties)
    const addProperty = (property: property) => {
        setProperties({ ...properties, [property.slug]: property })
    }

    const [modalList, setModalList] = useState<Array<ModalType>>([])
    const addModalList = (modal: ModalType) => {
        setModalList(prev => [...prev, modal])
    }
    const popModalList = () => {
        setModalList(arr => arr.filter((_, i) => i !== arr.length - 1))
    }
    const callback = (mode: string, property: property) => {
        if (mode === 'response') {
            popModalList() // el modal queda guardado en "property"
            if (property.parent) { // se verifica si no es el ultimo modal activo
                popModalList()!

                if (property.parent?.datatype === 'map') {
                    addModalList({
                        callback, mode: 'edit',
                        initProperty: { ...property.parent, properties: { ...property.parent.properties, [property.slug]: property } }
                    })
                }

                else if (property.parent?.datatype === 'list') {
                    const { datatype, multiline, properties, url } = property
                    addModalList({
                        callback, mode: 'edit',
                        initProperty: { ...property.parent, of: { datatype, multiline, properties, url } }
                    })
                }
            }
            else {
                addProperty(property)
                setSelectProperty(property)
            }
        }
        if (mode === 'create') {
            let newProperty: property = { datatype: 'textField', name: '', slug: '', parent: property }
            addModalList({ callback, mode: 'create', initProperty: newProperty })
        }
        if (mode === 'edit') {
            console.log(property)
            addModalList({ callback, mode: 'edit', initProperty: property })
        }
        if (mode === 'close') {
            popModalList()
        }
    }

    const onSubmitHandler = () => {
        let orfanProperty: Record<string, property> = {}
        for (let key in properties) {
            orfanProperty[key] = deleteKey(properties[key])!
        }
        newCollection.properties = orfanProperty

        // Se agrega la nueva coleccion al session storage
        const collections: Array<scheme> = storageCollections ? storageCollections as scheme[] : []
        setStorageCollections([...collections, newCollection])
        //addDoc(collection(firebase.db, "cms_collections"), newCollection)

        // Se reinician los valores de la coleccion
        setStorage({})
        setProperties(undefined)
        close()
    }
    return (
        <section className='editProperties'>
            <div className="properties">
                <div className='properties-body'>
                    <div className='properties-header'>
                        <h1>Pages</h1>
                        <Button onPress={() => { addModalList({ mode: 'create', callback: callback }) }}>+</Button>
                    </div>
                    {properties ? Object.values(properties).map((e, i) => {
                        return (
                            <div key={`property-${i}`} className="property">
                                <BsFillCollectionFill />
                                <Card isPressable onPress={() => setSelectProperty(e)} className="property-card">
                                    <CardHeader className="card-header">
                                        <h2>{e.name}</h2>
                                        <Link onPress={() => { console.log(0) }}><FaTrash /></Link>
                                    </CardHeader>
                                    <CardBody className="card-body">
                                        <p className="text-primary">{e.datatype}</p>
                                    </CardBody>
                                </Card>
                            </div>
                        )
                    }) : ''}
                    <Button fullWidth onPress={() => { addModalList({ mode: 'create', callback: callback }) }}>Add Property</Button>
                </div>
                <div className='properties-detail'>
                    {selectProperty ?
                        <div className="selected">
                            <header>
                                <h3>{selectProperty.datatype}</h3>
                                <Link onPress={() => addModalList({ mode: 'edit', callback: callback, initProperty: selectProperty })}><FaGear /></Link>
                            </header>
                            <Input label='Field name' value={selectProperty.name} disabled />
                            <Input label='ID' value={selectProperty.slug} disabled />
                            <Input label='Description' value={selectProperty.description} disabled />
                            {selectProperty.datatype === 'url' ? <Input label='Url' value={selectProperty.url} disabled /> : ''}
                            {selectProperty.datatype === 'list' && selectProperty.of ? <Input label='List type' value={selectProperty.of.datatype} disabled /> : ''}
                        </div> : ''
                    }
                </div>
            </div>
            <footer>
                <Link onPress={close}>Cancel</Link>
                <Button onPress={onSubmitHandler}>Update Collection</Button>
            </footer>
            {modalList?.map((e, i) => { return <ModalNewProperty key={`modal-${i}`} {...e} /> })}
        </section>
    )
}
export default EditProperties;