'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Role = 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'FRONT_DESK' | 'PRACTITIONER'

interface NavItem  { label: string; href: string; icon: string; badge?: number }
interface NavGroup { section: string | null; items: NavItem[] }

const superAdminNav: NavGroup[] = [
  { section: null, items: [
    { label: 'Overview',      href: '/admin',                 icon: '▦' },
  ]},
  { section: 'Platform', items: [
    { label: 'Companies',     href: '/admin/companies',       icon: '🏢' },
    { label: 'Practitioners', href: '/admin/practitioners',   icon: '⚕' },
    { label: 'Staff',         href: '/admin/staff',           icon: '👥' },
    { label: 'Billing',       href: '/admin/billing',         icon: '💳' },
  ]},
  { section: 'Integration', items: [
    { label: 'FMCSA Setup',       href: '/admin/fmcsa',              icon: '🏛' },
    { label: 'TPO Designations',  href: '/admin/fmcsa/designations', icon: '✎' },
  ]},
  { section: 'Account', items: [
    { label: 'Sign Out',      href: '/login',                icon: '→' },
  ]},
]

function companyAdminNav(slug: string): NavGroup[] {
  const b = `/${slug}`
  return [
    { section: null, items: [
      { label: 'Dashboard',     href: `${b}/dashboard`,        icon: '▦' },
    ]},
    { section: 'Operations', items: [
      { label: 'Exams',         href: `${b}/examiner/exams`,   icon: '📋' },
      { label: 'FMCSA Reports', href: `${b}/examiner/submissions`, icon: '🏛' },
    ]},
    { section: 'People', items: [
      { label: 'Practitioners', href: `${b}/practitioners`,    icon: '⚕' },
      { label: 'Staff',         href: `${b}/staff`,            icon: '👥' },
      { label: 'Drivers',       href: `${b}/drivers`,          icon: '🚛' },
    ]},
    { section: 'Account', items: [
      { label: 'Billing',       href: `${b}/billing`,          icon: '💳' },
      { label: 'Settings',      href: `${b}/settings`,         icon: '⚙' },
      { label: 'Sign Out',      href: '/login',                icon: '→' },
    ]},
  ]
}

function practitionerNav(slug: string): NavGroup[] {
  const b = `/${slug}/examiner`
  return [
    { section: null, items: [
      { label: 'Dashboard',     href: `${b}`,                  icon: '▦' },
    ]},
    { section: 'DOT Physicals', items: [
      { label: 'All Exams',     href: `${b}/exams`,            icon: '📋' },
      { label: 'Add Exam',      href: `${b}/exams/add`,        icon: '+' },
      { label: 'Send Intake',   href: `${b}/send-intake`,      icon: '✉' },
    ]},
    { section: 'Immigration', items: [
      { label: 'I-693 Exams',   href: `${b}/immigration`,      icon: '🏥' },
      { label: 'New I-693',     href: `${b}/immigration/new`,  icon: '+' },
    ]},
    { section: 'FMCSA', items: [
      { label: 'Submissions',   href: `${b}/submissions`,      icon: '↑' },
      { label: 'Certificates',  href: `${b}/certificates`,     icon: '📜' },
    ]},
    { section: 'Account', items: [
      { label: 'Sign Out',      href: '/login',                icon: '→' },
    ]},
  ]
}

interface SidebarProps {
  companySlug:  string
  companyName:  string
  role:         Role
  userName?:    string
  userSub?:     string
  nrcmeExpiry?: string | null
}

export default function Sidebar({
  companySlug, companyName, role,
  userName    = 'Chantal Simpson-Gabriel',
  userSub     = 'Examiner',
  nrcmeExpiry,
}: SidebarProps) {
  const pathname = usePathname()

  const navGroups: NavGroup[] =
    role === 'SUPER_ADMIN'   ? superAdminNav :
    role === 'COMPANY_ADMIN' ? companyAdminNav(companySlug) :
    practitionerNav(companySlug)

  const initials = userName.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()

  function isActive(href: string) {
    if (href === '/login') return false
    if (href === '/admin' || href === `/${companySlug}/examiner` || href === `/${companySlug}/dashboard`) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div style={{
      width: 220, flexShrink: 0, height: '100vh',
      background: 'var(--sidebar)', display: 'flex',
      flexDirection: 'column', overflow: 'hidden',
    }}>

      {/* Logo */}
      <div style={{
        padding: '18px 18px 14px',
        borderBottom: '1px solid var(--sidebar-border)',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
          WorkOccMed<span style={{ color: '#4ade80', fontWeight: 400, marginLeft: 3 }}>Examiner</span>
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 3, letterSpacing: '.05em', textTransform: 'uppercase' }}>
          {companyName}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.section && (
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,.3)',
                padding: '14px 8px 5px',
              }}>
                {group.section}
              </div>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '7px 10px', borderRadius: 6, marginBottom: 1,
                    textDecoration: 'none', fontSize: 12.5, fontWeight: active ? 600 : 400,
                    background:   active ? 'var(--accent-bg)' : 'transparent',
                    color:        active ? '#fff' : 'rgba(255,255,255,.6)',
                    borderLeft:   active ? '2px solid var(--accent)' : '2px solid transparent',
                    transition:   'all .12s',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.07)'
                      ;(e.currentTarget as HTMLElement).style.color = '#fff'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent'
                      ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.6)'
                    }
                  }}
                >
                  <span style={{ fontSize: 13, lineHeight: 1, width: 16, textAlign: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {(item.badge ?? 0) > 0 && (
                    <span style={{
                      background: 'var(--accent)', color: '#fff',
                      fontSize: 9, padding: '1px 5px', borderRadius: 6, fontWeight: 700,
                    }}>{item.badge}</span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* NRCME badge */}
      {role === 'PRACTITIONER' && nrcmeExpiry && (
        <div style={{
          margin: '0 10px 8px',
          background: 'rgba(22,163,74,.15)',
          border: '1px solid rgba(22,163,74,.3)',
          borderRadius: 6, padding: '6px 10px', fontSize: 10,
        }}>
          <div style={{ color: '#4ade80', fontWeight: 700 }}>✓ NRCME Active</div>
          <div style={{ color: 'rgba(255,255,255,.4)', marginTop: 1 }}>Expires {nrcmeExpiry}</div>
        </div>
      )}

      {/* User footer */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--sidebar-border)',
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 9,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'var(--accent)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {userName}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 1 }}>{userSub}</div>
        </div>
      </div>
    </div>
  )
}
