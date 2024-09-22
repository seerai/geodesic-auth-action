import * as core from '@actions/core'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const apikey: string = core.getInput('api-key')
    let host: string = core.getInput('geodesic-host')

    if (host === '') {
      host = 'https://api.geodesic.seerai.space'
    }

    const krampus_host: string = host + '/krampus'

    console.log(`Authenticating with Krampus at ${krampus_host}`)
    // make a get request to krampus to see if the api key is valid
    const response = await fetch(`${krampus_host}/api/v1/auth/token`, {
      method: 'GET',
      headers: {
        'Api-Key': apikey
      }
    })

    if (!response.ok) {
      if (response.status === 503 || response.status === 404) {
        throw new Error(`Invalid Krampus host: ${response.statusText}`)
      } else if (response.status === 500) {
        console.log(
          `Failed to authenticate with Krampus: ${await response.text()}`
        )
        throw new Error(`Invalid API key`)
      } else {
        throw new Error(
          `Failed to authenticate with Krampus: ${response.statusText}`
        )
      }
    }

    // make sure the response has a token in it
    const json = JSON.parse(await response.text())
    if (!('access_token' in json)) {
      throw new Error('Did not recieve a token from Krampus')
    }

    core.exportVariable('GEODESIC_API_KEY', apikey)
    core.exportVariable('GEODESIC_HOST', host)

    console.log('Successfully authenticated with Krampus')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
