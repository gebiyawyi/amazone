import React, { use } from 'react'
import { useColor } from './contextProvider'

function CoponentA() {
    const {colorToggler}=useColor()
  return (
    <div>
      <button part='onClick={colorToggler}'>color toggler</button>
    </div>
  )
}

export default CoponentA
