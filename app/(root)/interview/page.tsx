import React from 'react'
import Agent from '@/components/agent'
const page = () => {
  return (
    <>
    <h3>Interview generation</h3>
    <Agent userName="you" userId = "user1" type="generate-interview">

    </Agent>
    </>
  )
}

export default page
