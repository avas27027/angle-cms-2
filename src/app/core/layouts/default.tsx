import { collections } from '../config/site';
import './default.scss'
import { Link } from '@heroui/link'

import { BsFillCollectionFill } from "react-icons/bs";
import { PiUsersThreeFill } from "react-icons/pi";
import { FaHeart } from "react-icons/fa";

export default function DefaultLayout({ title, subtitle, children, }: {
  title?: string,
  subtitle?: string,
  children: React.ReactNode;
}) {
  return (
    <div className='default_layout'>

      <section className='sidebar'>
        <div className='logo'>
          <FaHeart />
        </div>
        <div className='collections'>
          {collections.map((e, i) => {
            return (
              <div className='collection' key={`collection-${i}`}>
                <Link href={`/${e.path}`}>
                  <BsFillCollectionFill className='text-primary' />
                  <p className='text-primary'>{e.name}</p>
                </Link>
              </div>
            )
          })}
        </div>
        <div className='users'>
          <Link href='/users'>
            <PiUsersThreeFill className='text-primary' />
          </Link>
        </div>
      </section>
      <section className='content-layout'>
        <section className='navbar'>
          <h1><b>{title}</b></h1>
          <h3>{subtitle}</h3>
        </section>
        <section className='content-child'>
          {children}
        </section>
      </section>
    </div>
  );
}
