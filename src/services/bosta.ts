/**
 * Bosta Service (Client-Side Wrapper)
 * Calls the secure backend serverless function at /api/bosta to handle
 * all Bosta shipping actions, preventing CORS issues and keeping API
 * credentials safely on the server.
 */

export async function triggerCreateBostaOrder(orderId: string): Promise<any> {
  const response = await fetch(`/api/bosta?action=create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("[Bosta] Order Creation Backend Error:", response.status, responseText);
    let errMsg = `Server returned ${response.status}`;
    try {
      const data = JSON.parse(responseText);
      errMsg = data.error || errMsg;
    } catch {
      // non-JSON body
    }
    throw new Error(errMsg);
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}
