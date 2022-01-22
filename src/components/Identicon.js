import md5 from 'md5'
import NewIdenticon from 'identicon.js'

const Identicon = ({ className, context, size }) => {
  const user = context.getUser()

  let data = null
  if (!user) {
    // Base64 Encode of 1x1px Transparent GIF from
    // https://css-tricks.com/snippets/html/base64-encode-of-1x1px-transparent-gif/
    data = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  } else {
    const message = `heyzec-cvwo${user.id}`
    data = new NewIdenticon(md5(message), 420).toString()
  }

  return (
    <img className={className} width={size} height={size} src={`data:image/png;base64,${data}`} alt="identicon" />
  )
}
export default Identicon
