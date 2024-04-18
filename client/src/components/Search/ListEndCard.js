import React from 'react'

function ListEndCard({ label, onClick }) {
  return (
    <div className="w-full flex p-4 justify-center items-center h-21 bg-slate-950 cursor-pointer" onClick={onClick}>
      <h4 className="text-primary text-md font-bold leading-none text-default-600">{label}</h4>
    </div>
  )
}

export default ListEndCard
