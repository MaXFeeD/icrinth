export const trackEvent = (eventName, properties) => {
  console.log(
    `Received event ${eventName}${
      properties
        ? ` with ${Object.keys(properties)
            .map((key) => `${key}=${properties[key]}`)
            .join(', ')}`
        : ''
    }`,
  )
}
