import React from 'react'
import { Outlet, useParams } from 'react-router-dom'

type Props = {}

const TravelPlanDetails = (props: Props) => {
    const {id} = useParams();
  return (
    <>
        {id}
        <div>TravelPlanDetails</div>
        <h6>display documents , uploaded by hr </h6>
        <h6>display document uploaded by employee (status)</h6>
        add expense model with document attach 
    </>
  )
}

export default TravelPlanDetails