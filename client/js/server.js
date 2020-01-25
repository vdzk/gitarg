export const getInference = async (data) => {
  const url = 'https://f6jugjq6o5.execute-api.eu-west-1.amazonaws.com/dev/infer'
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return await response.json()
}
