# Delegation Model

> **Status:** **MAR-1 reviewed** — frozen for v1  
> **Parent:** [MAR-1 §1.5](./MAR-1-ARCHITECTURE_REVIEW.md) · [Volume 4](./VOLUME-4-IDENTITY_LAYER.md)

---

## Answers (binding)

| Question | Answer |
| -------- | ------ |
| Can an identity delegate authority? | **Yes** |
| Can authority be partial? | **Yes** — scoped by domain, object, action class |
| Can delegation expire? | **Yes** — `valid_until` required |
| Is delegation auditable? | **Yes** — grant, use, revoke events |
| Can it be revoked? | **Yes** — immediate for new actions |
| Can delegation chain? | **Yes** — max depth **3**; no circular grants |

---

## DelegationGrant schema

| Field | Type | Required |
| ----- | ---- | -------- |
| `grant_id` | UUID | Yes |
| `schema_version` | string | Yes |
| `grantor_ref` | identity_ref | Yes |
| `grantee_ref` | identity_ref | Yes |
| `grant_type` | enum | Yes |
| `scope` | DelegationScope | Yes |
| `valid_from` | ISO-8601 | Yes |
| `valid_until` | ISO-8601 | Yes |
| `revoked_at` | ISO-8601 | No |
| `revoke_reason` | string | If revoked |
| `parent_grant_id` | UUID | If chained |
| `chain_depth` | 1–3 | Yes |
| `lifecycle_state` | grant lifecycle | Yes |

---

## Grant types

| Type | Code | Permits | Policy gate |
| ---- | ---- | ------- | ----------- |
| **Read** | `read` | Recall within scope | Automatic if scope valid |
| **Capture** | `capture` | Write memory on behalf of grantor | Consent check |
| **Act** | `act` | Intelligence action on behalf | Human approval required |

`act` delegation does **not** bypass Policy — it routes approval to grantor.

---

## DelegationScope

```typescript
interface DelegationScope {
  domains: domain[];              // empty = none — must be explicit
  object_refs?: ref[];            // optional narrow targets
  action_classes?: string[];      // e.g. "recall", "capture", "recommend"
  privacy_tiers?: string[];       // max tier grantee may access
  exclude_personal_sovereign: boolean; // default true for personas
}
```

Partial authority is the **default** — full authority grants require explicit `scope.domains` = all institutional domains and grantor attestation.

---

## Chaining rules

```txt
Executive (grantor)
    └── Persona (grantee, depth 1)
            └── Sub-agent (grantee, depth 2) — optional
                    └── depth 3 maximum
```

| Rule | Description |
| ---- | ----------- |
| C1 | `chain_depth` = parent.depth + 1 |
| C2 | Grantee at depth N cannot grant permissions grantor didn't hold |
| C3 | Circular grants rejected at validation |
| C4 | Revoking parent grant cascades revoke to children |
| C5 | Each use records `grant_id` + `chain_depth` in audit |

---

## Lifecycle

| State | Meaning |
| ----- | ------- |
| `proposed` | Awaiting grantor approval |
| `active` | In force within validity window |
| `expired` | `valid_until` passed — natural end |
| `revoked` | Terminated by grantor or policy |

Expired and revoked grants remain in store for audit — never deleted.

---

## Audit events

| Event | Fields |
| ----- | ------ |
| `delegation.grant` | `grant_id` · grantor · grantee · scope |
| `delegation.use` | `grant_id` · action · resource · outcome |
| `delegation.revoke` | `grant_id` · revoker · reason |
| `delegation.expire` | `grant_id` · `valid_until` |

---

## Persona defaults

Assistant personas (Chief of Staff, department agents):

- Operate only under active `DelegationGrant`
- Default `exclude_personal_sovereign: true`
- `capture` grants scoped to institutional domains only
- `act` grants require executive approval workflow

---

## Factory boundary

Factory delivers empty identity templates. No delegation exists until Executive Discovery + explicit grant.

---

*Delegation Model · MAR-1 · Memory OS spec v1 draft*
