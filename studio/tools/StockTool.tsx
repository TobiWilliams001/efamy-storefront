import {useCallback, useEffect, useState} from 'react'
import {useClient} from 'sanity'

type Variant = {_key: string; size?: string; heat?: string; stock?: number}
type Row = {_id: string; name: string; image?: string; variants?: Variant[]}

/* The jar, small: at a glance it is faster to recognise than a name. */
const QUERY = `*[_type == "product"]|order(name asc){
  _id, name, "image": image.asset->url + "?w=96&h=96&fit=crop&auto=format",
  variants[]{_key, size, heat, stock}
}`

/**
 * Every size on one page, each with a box to type a number into.
 *
 * The alternative is opening twenty products and scrolling to the sizes inside
 * each, which is where a stock take goes wrong. Saving happens when a box loses
 * focus, so a half-typed number is never written.
 */
export function StockTool() {
  const client = useClient({apiVersion: '2026-05-15'})
  const [rows, setRows] = useState<Row[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(() => {
    client.fetch<Row[]>(QUERY).then(setRows)
  }, [client])

  useEffect(load, [load])

  const save = useCallback(
    async (id: string, key: string, raw: string) => {
      setBusy(`${id}:${key}`)
      const value = raw.trim()
      const patch = client.patch(id)
      await (value === ''
        ? patch.unset([`variants[_key=="${key}"].stock`])
        : patch.set({
            [`variants[_key=="${key}"].stock`]: Math.max(
              0,
              Math.floor(Number(value)),
            ),
          })
      ).commit()
      setBusy(null)
      load()
    },
    [client, load],
  )

  if (!rows) return <p style={{padding: 24, fontFamily: 'sans-serif'}}>Loading…</p>

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 720,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      }}
    >
      <h1 style={{margin: 0, fontSize: 20}}>Stock</h1>
      <p style={{margin: '8px 0 24px', color: '#666', fontSize: 14, lineHeight: 1.5}}>
        How many of each size you have. A size comes off the shop by itself at
        zero, and returns when you put a number in. Leave a box empty to stop
        counting that size.
      </p>

      {rows.map((row) => (
        <div
          key={row._id}
          style={{
            border: '1px solid #e3e4e8',
            borderRadius: 6,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
            }}
          >
            {row.image ? (
              <img
                src={row.image}
                alt=""
                width={48}
                height={48}
                style={{
                  width: 48,
                  height: 48,
                  objectFit: 'contain',
                  borderRadius: 4,
                  background: '#f6f6f8',
                  flexShrink: 0,
                }}
              />
            ) : null}
            <p style={{margin: 0, fontWeight: 600, fontSize: 15}}>{row.name}</p>
          </div>

          {(row.variants ?? []).map((variant) => {
            const label =
              [variant.size, variant.heat].filter(Boolean).join(', ') ||
              'One size'
            const out = variant.stock === 0
            const low =
              typeof variant.stock === 'number' &&
              variant.stock > 0 &&
              variant.stock <= 5

            return (
              <div
                key={variant._key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '6px 0',
                }}
              >
                <span style={{flex: 1, fontSize: 14}}>{label}</span>

                {out ? (
                  <span style={{color: '#c0392b', fontSize: 12, fontWeight: 600}}>
                    Sold out
                  </span>
                ) : null}
                {low ? (
                  <span style={{color: '#b7791f', fontSize: 12, fontWeight: 600}}>
                    Low
                  </span>
                ) : null}

                <input
                  type="number"
                  min={0}
                  aria-label={`${row.name}, ${label}, number in stock`}
                  placeholder="Not counted"
                  defaultValue={
                    typeof variant.stock === 'number' ? String(variant.stock) : ''
                  }
                  disabled={busy === `${row._id}:${variant._key}`}
                  onBlur={(event) =>
                    save(row._id, variant._key, event.currentTarget.value)
                  }
                  style={{
                    width: 110,
                    padding: '6px 8px',
                    border: '1px solid #ced2d9',
                    borderRadius: 4,
                    fontSize: 14,
                  }}
                />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
