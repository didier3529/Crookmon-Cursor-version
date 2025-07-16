import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { DuelTurnResult } from '../../types'
import analyticsService from '../../services/analyticsservice'

export interface BattleScreenHandle {
  animateTurn: (result: DuelTurnResult) => void
}

export interface BattleScreenProps {}

const BattleScreen = forwardRef<BattleScreenHandle, BattleScreenProps>(function BattleScreen(
  _,
  ref
) {
  const [queue, setQueue] = useState<DuelTurnResult[]>([])
  const [current, setCurrent] = useState<DuelTurnResult | null>(null)
  const attackerRef = useRef<HTMLDivElement>(null)
  const defenderRef = useRef<HTMLDivElement>(null)

  const animateTurn = useCallback((result: DuelTurnResult) => {
    setQueue((q) => [...q, result])
  }, [])

  useImperativeHandle(ref, () => ({ animateTurn }), [animateTurn])

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0])
    }
  }, [queue, current])

  const onAnimationEnd = useCallback(() => {
    setCurrent(null)
    setQueue((q) => q.slice(1))
  }, [])

  useEffect(() => {
    if (!current) return
    analyticsService.logEvent('turn_animation_started', {
      attacker: current.attacker.id,
      defender: current.defender.id,
      outcome: current.outcome,
      damage: current.damage,
    })
    const aEl = attackerRef.current
    const dEl = defenderRef.current
    if (!aEl || !dEl) {
      onAnimationEnd()
      return
    }
    const className = (() => {
      switch (current.outcome) {
        case 'miss':
          return 'attack-miss'
        case 'critical':
          return 'attack-critical'
        case 'block':
          return 'attack-block'
        default:
          return 'attack-hit'
      }
    })()
    aEl.classList.add(className)
    dEl.classList.add(className)
    aEl.addEventListener('animationend', onAnimationEnd, { once: true })
    return () => {
      aEl.removeEventListener('animationend', onAnimationEnd)
      aEl.classList.remove('attack-hit', 'attack-miss', 'attack-critical', 'attack-block')
      dEl.classList.remove('attack-hit', 'attack-miss', 'attack-critical', 'attack-block')
    }
  }, [current, onAnimationEnd])

  return (
    <div className="battle-screen">
      <div className="player-area attacker-area" ref={attackerRef}>
        <div className="avatar">
          <img src={current?.attacker.avatarUrl || '/assets/placeholder.png'} alt={current?.attacker.name || 'Attacker'} />
        </div>
        <div className="health-bar">
          <div className="health-fill" style={{ width: `${current ? current.attacker.currentHpPercent : 100}%` }} />
        </div>
      </div>
      <div className="player-area defender-area" ref={defenderRef}>
        <div className="avatar">
          <img src={current?.defender.avatarUrl || '/assets/placeholder.png'} alt={current?.defender.name || 'Defender'} />
        </div>
        <div className="health-bar">
          <div className="health-fill" style={{ width: `${current ? current.defender.currentHpPercent : 100}%` }} />
        </div>
      </div>
    </div>
  )
})

export default BattleScreen
