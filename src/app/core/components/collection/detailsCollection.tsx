import { Input, Textarea } from "@heroui/input";
import { Button, Link, Radio, RadioGroup } from "@heroui/react";
import { useState } from "react";
import { slugify } from "../../../shared/Utils";
import './detailsCollection.scss';
import { Key } from "@react-types/shared";
import useSessionStorage from "../../../shared/hooks/useSessionStorage";
import { type scheme } from "../../types";

const DetailsCollection: React.FC<{ callback: (key: Key) => void, close: () => void }> = ({callback, close}) => {
    const [storage, setStorage] = useSessionStorage('newCollection')
    const [selected, setSelected] = useState("catalog");
    const [name, setName] = useState((storage as scheme).name ? (storage as scheme).name : "")
    const [path, setPath] = useState((storage as scheme).path ? (storage as scheme).path : "")
    const [description, setDescription] = useState((storage as scheme).description ? (storage as scheme).description : "")

    const submitCallback = () => {
        const newCollection = { name, path, description, view: selected, icon: "" }
        setStorage(newCollection)
        callback('properties')
    }
    return (
        <section className='create'>
            <div className='content'>
                <h1>New Collection</h1>
                <Input label="Name" value={name} onValueChange={(value) => { setName(value); setPath(slugify(value)) }}></Input>
                <div className='flex gap-2 mt-2'>
                    <Input label="Path" disabled value={path} />
                    <Textarea label='Description' value={description} onValueChange={setDescription}></Textarea>
                </div>

                <h3>Document View</h3>
                <RadioGroup value={selected} onValueChange={setSelected}>
                    <Radio value={'catalog'}>Catalog</Radio>
                    <Radio value={'single-page'}>Single Page</Radio>
                </RadioGroup>

            </div>
            <footer>
                <Link onPress={close}>Cancel</Link>
                <Button isDisabled={name === "" ? true : false} onPress={submitCallback}>Next</Button>
            </footer>
        </section>
    )
}
export default DetailsCollection;