
const qs = require('querystring')
const { isArray } = require('util')

// excerpt from [RFC 6265](https://tools.ietf.org/html/rfc6265#section-4.1.1)
// set-cookie-header = "Set-Cookie:" SP set-cookie-string
// set-cookie-string = cookie-pair *( ";" SP cookie-av )
// cookie-pair       = cookie-name "=" cookie-value
// cookie-name       = token
// cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
// cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
//                       ; US-ASCII characters excluding CTLs,
//                       ; whitespace DQUOTE, comma, semicolon,
//                       ; and backslash
// token             = <token, defined in [RFC2616], Section 2.2>
// ...
// cookie-header = "Cookie:" OWS cookie-string OWS
// cookie-string = cookie-pair *( ";" SP cookie-pair )

// more definitions from [RFC 2616](https://tools.ietf.org/html/rfc2616#section-2.2)
// OCTET          = <any 8-bit sequence of data>
// CHAR           = <any US-ASCII character (octets 0 - 127)>
// UPALPHA        = <any US-ASCII uppercase letter "A".."Z">
// LOALPHA        = <any US-ASCII lowercase letter "a".."z">
// ALPHA          = UPALPHA | LOALPHA
// DIGIT          = <any US-ASCII digit "0".."9">
// CTL            = <any US-ASCII control character
//                 (octets 0 - 31) and DEL (127)>
// CR             = <US-ASCII CR, carriage return (13)>
// LF             = <US-ASCII LF, linefeed (10)>
// SP             = <US-ASCII SP, space (32)>
// HT             = <US-ASCII HT, horizontal-tab (9)>
// <">            = <US-ASCII double-quote mark (34)>
// token          = 1*<any CHAR except CTLs or separators>
// separators     = "(" | ")" | "<" | ">" | "@"
//                | "," | ";" | ":" | "\" | <">
//                | "/" | "[" | "]" | "?" | "="
//                | "{" | "}" | SP | HT

const COOKIE_RULE = /^([^\u0000-\u001F\u00FF()<>@,;:\\"/[\]?={} ]+)=((?:%x[\dA-Fa-f]{2}|[^\u0000-\u001F ",;\\])*)((?:; .*)*)$/

function makeCookie() {
  
}

class Jar {
  constructor () {
    this.cookies = new Map()
  }

  add(str) {
    if (isArray(str)) {
      str.forEach(raw => this.add(raw))
    } else {
      let result = str.match(COOKIE_RULE)

      if (result === null) {
        throw new Error(`Invalid cookie string: ${str}`)
      }

      this.cookies.set(result[1], qs.unescape(result[2]))
    }
  }

  remove(key) {
    this.cookies.delete(key)
  }

  toString() {
    return [...this.cookies].map(kv => `${kv[0]}=${qs.escape(kv[1])}`).join('; ')
  }
}

module.exports = Jar