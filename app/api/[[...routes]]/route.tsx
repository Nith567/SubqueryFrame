/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, parseEther } from 'frog'
import { handle } from 'frog/vercel'
import { neynar } from 'frog/hubs'
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit'
import { erc20Abi, parseUnits } from 'viem';

const app = new Frog({
  basePath: '/api',
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY as string}),
  verify:'silent',
})

function numberToHexByte(num: number): string {
  if (num < 0 || num > 255) {
    throw new Error('Number out of byte range (0-255)')
  }
  return `0x${num.toString(16).padStart(2, '0')}`
}

const endpoint='https://api.subquery.network/sq/subquery/subquery-mainnet'
async function fetchGraphQL(query: string) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await response.json()
  return data
}

app.frame('/', (c) => {
  return c.res({   
    action: '/query',
    image: `https://gateway.lighthouse.storage/ipfs/bafkreiddpzek7lluliug2b66lgfkk6h3mn7or46m77m4nlxlqf7p3sphcu`,
    imageAspectRatio:"1:1",
    headers:{
      'Content-Type': 'image/jpeg'
    },
    intents: [
  <TextInput placeholder="(Enter integer)" />,
  <Button key='send-usdc'>Query</Button>,
    ]
  })
})
app.frame('/query', async(c) => {
  const { inputText = '' } = c
  if (!Number.isInteger(Number(inputText))) {
    return c.res({   
      action: '/',
      image:(
        <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
          fontSize: 80,
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 30,
            fontWeight: 500,
            margin: 1,
          }}
        >
        Please enter a valid integer
        </p>
      </div>
    ),
      imageAspectRatio:"1:1",
      headers:{
        'Content-Type': 'image/jpeg'
      },
      intents: [
    <Button key='/'> Retry</Button>,
      ]
    })
  }
  else{
try{
  const query = `query {
    era(id: "${numberToHexByte(Number(inputText))}") {
      startTime
      nodeId
      lastEvent
      id
      endTime
      createdBlock
    }
  }`

  const data = await fetchGraphQL(query)
  const node = data.data.era
console.log(node);
  return c.res({   
    action: '/',
    image:(
      <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
        fontSize: 80,
        fontWeight: 700,
        textAlign: 'center',
      }}
    >
       {/* <img src={firstProduct.image_src} alt={firstProduct.title} height={390}/> */}
      <p
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
          backgroundClip: 'text',
          color: 'transparent',
          fontSize: 40,
          fontWeight: 500,
          margin: 1,
        }}
      >
  Era {inputText} started At  {node.createdBlock}
        {' '}
      </p>
    </div>
  ),
    imageAspectRatio:"1:1",
    headers:{
      'Content-Type': 'image/jpeg'
    },
    intents: [
  <Button key='home'> Home</Button>,
    ]
  })
}
catch(error){
  return c.res({   
    action: '/',
    image:(
      <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
        fontSize: 80,
        fontWeight: 700,
        textAlign: 'center',
      }}
    >
      <p
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
          backgroundClip: 'text',
          color: 'transparent',
          fontSize: 40,
          fontWeight: 500,
          margin: 1,
        }}
      >
     OOPS! Error while fetching Data
      </p>
    </div>
  ),
    imageAspectRatio:"1:1",
    headers:{
      'Content-Type': 'image/jpeg'
    },
    intents: [
  <Button key='/'> Back</Button>,
    ]
  })

}
}
})


export const GET = handle(app)
export const POST = handle(app)
