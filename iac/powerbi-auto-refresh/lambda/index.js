const AZURE_AUTH_ENDPOINT = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`
const POWERBI_REFRESH_ENDPOINT = `https://api.powerbi.com/v1.0/myorg/datasets/${process.env.POWERBI_DATASOURCE_ID}/refreshes`

const AUTH_PAYLOAD = process.env.AUTH_PAYLOAD

exports.handler = async (event, context) => {
    if (
        !process.env.AUTH_PAYLOAD ||
        !process.env.AZURE_TENANT_ID ||
        !process.env.POWERBI_DATASOURCE_ID
    ) return exit(400, "Missing environment variables")

    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(JSON.parse(AUTH_PAYLOAD))) {
        params.append(key, val)
    }

    const requestOptions = {
        method: "POST",
        headers,
        body: params,
    };

    const authResponse = await fetch("https://login.microsoftonline.com/9740a105-cc0a-401d-89b8-e8292ac04253/oauth2/v2.0/token", requestOptions)

    if (!authResponse.ok) {
        return exit(authResponse.status, "Failed to fetch OAuth token from Microsoft")
    }

    const { access_token } = await authResponse.json();

    const refreshResponse = await fetch(POWERBI_REFRESH_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    })

    return exit(refreshResponse.status, undefined)
}

const exit = (status, message) => ({
    statusCode: status, body: { message }
})