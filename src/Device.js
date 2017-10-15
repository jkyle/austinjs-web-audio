import React from 'react'
import style from './style.styl'

export default ({ name, children }) => (
  <section className={style.device}>
    <h3 className={style.title}>{name || 'Device'}</h3>
    {children}
  </section>
)
