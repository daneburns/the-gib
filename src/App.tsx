import { useEffect, useState } from 'react'
import type { Character } from './types'
import { loadAll, newCharacter, remove, upsert } from './storage'
import { generatePerson } from './generator'
import Roster from './components/Roster'
import Creator from './components/Creator'
import PersonRecord from './components/PersonRecord'

type View =
  | { name: 'roster' }
  | { name: 'create'; draft: Character }
  | { name: 'view'; id: string }

export default function App() {
  const [characters, setCharacters] = useState<Character[]>(() => loadAll())
  const [view, setView] = useState<View>({ name: 'roster' })

  // Keep the tab title honest.
  useEffect(() => {
    document.title =
      view.name === 'view'
        ? `${characters.find((c) => c.id === view.id)?.designation || 'Person'} — GIB-2`
        : 'THE GIB — Records Room'
  }, [view, characters])

  function handleSave(c: Character) {
    setCharacters(upsert(c))
    setView({ name: 'view', id: c.id })
  }

  function handleDelete(id: string) {
    setCharacters(remove(id))
    setView({ name: 'roster' })
  }

  function handleLiveChange(c: Character) {
    setCharacters(upsert(c))
  }

  function conjuredDraft(): Character {
    return { ...newCharacter(), ...generatePerson() }
  }

  if (view.name === 'create') {
    return (
      <Shell>
        <Creator
          initial={view.draft}
          onSave={handleSave}
          onCancel={() => setView({ name: 'roster' })}
        />
      </Shell>
    )
  }

  if (view.name === 'view') {
    const character = characters.find((c) => c.id === view.id)
    if (!character) {
      return (
        <Shell>
          <Roster
            characters={characters}
            onOpen={(id) => setView({ name: 'view', id })}
            onNew={() => setView({ name: 'create', draft: newCharacter() })}
            onConjure={() => setView({ name: 'create', draft: conjuredDraft() })}
            onDelete={handleDelete}
          />
        </Shell>
      )
    }
    return (
      <Shell>
        <PersonRecord
          character={character}
          onChange={handleLiveChange}
          onEdit={() => setView({ name: 'create', draft: character })}
          onBack={() => setView({ name: 'roster' })}
        />
      </Shell>
    )
  }

  return (
    <Shell>
      <Roster
        characters={characters}
        onOpen={(id) => setView({ name: 'view', id })}
        onNew={() => setView({ name: 'create', draft: newCharacter() })}
        onConjure={() => setView({ name: 'create', draft: conjuredDraft() })}
        onDelete={handleDelete}
      />
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <div className="app-frame">{children}</div>
      <footer className="app-footer no-print">
        For measuring the unmeasurable, and billing you for it. · Records held locally
        in this browser only.
      </footer>
    </div>
  )
}
