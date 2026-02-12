import React from 'react'
import { Outlet, useParams } from 'react-router-dom'

type Props = {}

const TravelPlanDetails = (props: Props) => {
    const {id} = useParams();
  return (
    <>
        {id}
        <div>TravelPlanDetails</div>
    </>
  )
}

export default TravelPlanDetails