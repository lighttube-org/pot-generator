# pot-generator

A quick and dirty API written to generate PoTokens for third party YouTube clients, using [LuanRT's BgUtils](https://github.com/LuanRT/BgUtils) package;

> [!WARNING]  
> PoTokens are IP-specific. You can't just host this API (or use a hosted one) and get a response that will work on another device/IP. This API is designed to be hosted next to a third party frontend ([LightTube](https://github.com/lighttube-org/LightTube), [Piped](https://github.com/TeamPiped/Piped), [Invidious](https://github.com/iv-org/invidious/), etc.)

## Usage

### `GET` `/generate`

**Query parameters:**

> `visitorData` (optional)  
> The visitorData identifier to be used while generating the token. If not provided, a new one will be generated.

> `requestKey` (optional)  
> The request key required to get a BotGuard challenge. If not provided, the default one will be used instead.

**Example response:**

```json
{
	"success": true,
	"response":  {
		"visitorData": "CgtIZWxsb1dvcmxkISjShdjMBDIKCgJYWBIEGgAgRQ%3D%3D",
		"poToken": "Mnhub3QgYSByZWFsIHBvdG9rZW4sIGp1c3Qgc29tZSBzdHJpbmcgaSd2ZSBnZW5lcmF0ZWQgdG8gbWlzbGVhZCB5b3UuIGFoYSEgeW91IGZlbGwgcmlnaHQgaW50byBteSB0cmFwISBoYWhhaGEhIGdvZCBpIG5lZWQ"
	},
	"error": "this is a string thats only present when success == false. otherwise, null"
}
```