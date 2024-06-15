import logo from './assets/logo/dark/logo.svg'
// service-worker.js
self.addEventListener('push', (event) => {
  const data = event.data.json()
  console.log(data)
  const options = {
    body: data.body,
    icon: logo, // Replace with your icon path
    data: {
      url: data.link,
    },
  }
  event.waitUntil(self.registration.showNotification(data.title, options))
})
