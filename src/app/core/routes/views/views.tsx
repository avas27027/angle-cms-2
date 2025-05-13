import DefaultLayout from "../../layouts/default";
import './views.scss';
import { collections } from "../../config/site";
import { FaArrowRight, FaTrash } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { Link } from "@heroui/link";
import { useDisclosure } from "@heroui/react";
import ModalEditCollection from "../../components/modals/modalEditCollection";
import { useEffect, useState } from "react";
import { type scheme } from "../../types";
import useSessionStorage from "../../../shared/hooks/useSessionStorage";

export default function Views() {
  const [storageValue, setStorageValue] = useSessionStorage('collections')
  const [_, setStorage] = useSessionStorage('newCollection')
  // Se agrega las colecciones de la BD a el session storage
  useEffect(() => {
    setStorageValue(collections)
    setStorage({})
  }, [])

  const modal = useDisclosure()
  const [mode, setMode] = useState<"properties" | "details" | "">('details')

  const closeHandler = () => { setMode("") }
  return (
    <DefaultLayout title="Belleza y Salud">
      <section className="views">
        <div className="title">Views</div>
        <div className="grid-views">
          {(storageValue as Array<scheme>)?.map((e, i) => {
            return (
              <div key={`collection-${i}`} className="collection-card">
                <div className="icons">
                  <Link><FaTrash /></Link>
                  <Link onPress={() => { setMode('properties'); modal.onOpen(); setStorage(e);}}><FaGear /></Link>
                </div>
                <div className="content">
                  <h1>{e.name}</h1>
                  <p>{e.description}</p>
                </div>
                <div className="search">
                  <Link ><FaArrowRight /></Link>
                </div>
              </div>
            )
          })}
          <div className="collection-card">
            <Link onPress={() => { setMode('details'); modal.onOpen(); }} className="flex flex-col justify-center items-center h-full" size="lg"><span>+</span> <p>Add new Collection</p></Link>
          </div>
        </div>
      </section>
      <ModalEditCollection {...{ disclosure: modal, mode, close: closeHandler }} />
    </DefaultLayout>
  )
}
