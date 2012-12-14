# crosstalk-worker-api-sendgrid-smtp
============================

`crosstalk-worker-rss-checker` is a Crosstalk worker for checking rss feeds

## Configuration

```json
{
  "feedURI" : "feed uri (required)",
  "checkFrequency" : minutes >= 5,
	"target" : "message name for new items (default: rss.new)"
}
```

## crosstalk.on

None

## crosstalk.emit

rss.new (or configured target)

## http in

None

## http out

Configured Feed URI

## https in

None

## https out

Configured Feed URI
