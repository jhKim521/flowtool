# HTTPie Examples

## Echo

```bash
http POST :3000/api/test/echo \
source==manual \
message="hello"
```

## Error

```bash
http GET :3000/api/test/error
```

## Health

```bash
http GET :3000/health
```