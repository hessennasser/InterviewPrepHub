import React from 'react'
import { BallTriangle } from 'react-loader-spinner'

const LoaderInComponent = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#1c64f2"
        ariaLabel="ball-triangle-loading"
        wrapperClass={{}}
        wrapperStyle=""
        visible={true}
      />
    </div>
  )
}

export default LoaderInComponent
