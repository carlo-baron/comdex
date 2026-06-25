"use client";

import { calculate, Generations, Pokemon, Move, Field } from '@smogon/calc';
import { type StatsTable } from '@smogon/calc/dist/data/interface';
import BuiltMonsDialog from "./BuiltMonsDialog";
import { title } from "@/utils/titleCase";
import { useState, useCallback, useMemo } from "react";
import { Plus, X, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Separator } from "./ui/separator";
import { Toggle } from "@/components/ui/toggle"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { usePokemonDataStore } from '@/hooks/PokemonDataStore';

import {
  GameType,
  Weather,
  Terrain,
} from "@smogon/calc/dist/data/interface";

type CalcSlot = 'attacker' | 'defender';

const gen = Generations.get(9);

function toCalcStats(stats: Record<string, number>): Partial<StatsTable> {
  return {
    hp: stats.hp,
    atk: stats.attack,
    def: stats.defense,
    spa: stats['special-attack'],
    spd: stats['special-defense'],
    spe: stats.speed,
  };
}

export default function DamageCalcDialog(
  {
    open,
    onOpenChange
  }
  :
  {
    open: boolean;
    onOpenChange: () => void;
  }
){
  const [addMonSlot, setAddMonSlot] = useState<CalcSlot | null>(null);
  const [attackerId, setAttackerId] = useState<string | null>(null);
  const [defenderId, setDefenderId] = useState<string | null>(null);
  const [attackerMove, setAttackerMove] = useState<string | null>(null);

  const attacker = usePokemonDataStore(state => attackerId ? state.pokemon[attackerId] : null);
  const defender = usePokemonDataStore(state => defenderId ? state.pokemon[defenderId] : null);

  const [gameType, setGameType] = useState<GameType>('Doubles');
  const [terrain, setTerrain] = useState<Terrain | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [spikes, setSpikes] = useState<number>(0);
  const [isFairyAura, setIsFairyAura] = useState(false);
  const [isGravity, setIsGravity] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [isHelpingHand, setIsHelpingHand] = useState(false);
  const [isAuroraVeil, setIsAuroraVeil] = useState(false);
  const [screens, setScreens] = useState<string[]>([]);
  const [isTailwind, setIsTailwind] = useState(false);
  const [isFriendGuard, setIsFriendGuard] = useState(false);
  const [isStealthRock, setIsStealthRock] = useState(false);
  const [isSaltCure, setIsSaltCure] = useState(false);

  const resultText: string = useMemo(() => {
    if (!attackerMove || !attacker || !defender) return '';

    const result = calculate(
      gen,
      new Pokemon(gen, attacker.name, {
        item: attacker.selectedItem?.name ?? undefined,
        nature: title(attacker.nature),
        level: attacker.level,
        evs: toCalcStats(attacker.evs),
        ivs: toCalcStats(attacker.ivs),
      }),
      new Pokemon(gen, defender.name, {
        item: defender.selectedItem?.name ?? undefined,
        nature: title(defender.nature),
        level: defender.level,
        evs: toCalcStats(defender.evs),
        ivs: toCalcStats(defender.ivs),
      }),
      new Move(gen, attackerMove),
      new Field({
        gameType,
        terrain: terrain ?? undefined,
        weather: weather ?? undefined,
        isGravity,
        isFairyAura,
        attackerSide: {
          isHelpingHand,
          isTailwind,
          isFriendGuard,
        },
        defenderSide: {
          spikes,
          isProtected,
          isAuroraVeil,
          isReflect: screens.includes('reflect'),
          isLightScreen: screens.includes('light-screen'),
          isSR: isStealthRock,
          isSaltCured: isSaltCure,
        },
      })
    );

    const damage = Array.isArray(result.damage)
      ? result.damage
      : [result.damage];

    const minDamage = Math.min(...damage);
    const maxDamage = Math.max(...damage);

    const minPercent = (
      (minDamage / result.defender.stats.hp) *
      100
    ).toFixed(1);

    const maxPercent = (
      (maxDamage / result.defender.stats.hp) *
      100
    ).toFixed(1);

    if (maxDamage === 0) {
      return `0% damage (${result.desc()})`;
    }

    let koText = '';
    try {
      koText = result.kochance().text;
    } catch {
      koText = 'No KO';
    }

    return `${koText} (${minPercent}% - ${maxPercent}%)`;
  }, [
    attacker,
    defender,
    attackerMove,
    gameType,
    terrain,
    weather,
    isGravity,
    isFairyAura,
    isHelpingHand,
    isTailwind,
    isFriendGuard,
    spikes,
    isProtected,
    isAuroraVeil,
    screens,
    isStealthRock,
    isSaltCure,
  ]);

  const handleOpenAddMon = useCallback((slot: CalcSlot) => {
    setAddMonSlot(slot);
  }, []);

  const handleSelectMon = useCallback((id: string) => {
    if (addMonSlot === 'attacker') {
      setAttackerId(id);
      setAttackerMove(null);
    }
    if (addMonSlot === 'defender') setDefenderId(id);
    setAddMonSlot(null);
  }, [addMonSlot]);

  const handleSwap = useCallback(() => {
    setAttackerId(defenderId);
    setDefenderId(attackerId);
    setAttackerMove(null);
  }, [attackerId, defenderId]);

  const renderMonSlot = (slot: CalcSlot, id: string | null, mon: typeof attacker) => {
    if (!id || !mon) {
      return (
        <div className="flex justify-center items-center outline aspect-square w-30">
          <Button
            variant='outline'
            className='w-full h-full'
            onClick={() => handleOpenAddMon(slot)}
          >
            <Plus size={98}/>
          </Button>
        </div>
      );
    }
    return (
      <div className="relative flex flex-col items-center gap-1 w-30">
        <X
          size={16}
          className="absolute -top-1 -right-1 cursor-pointer bg-background rounded-full"
          onClick={() => {
            if (slot === 'attacker') {
              setAttackerId(null);
              setAttackerMove(null);
            } else {
              setDefenderId(null);
            }
          }}
        />
        <img src={mon.sprite} alt={mon.name} className="aspect-square w-full" />
        <p className="text-sm font-bold capitalize">{mon.name}</p>
        <div className="flex gap-1">
          {mon.types.map((t, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded bg-muted capitalize">
              {t.type.name}
            </span>
          ))}
        </div>
        <div className="text-xs text-muted-foreground text-center">
          Lv.{mon.level} {mon.nature}
        </div>
        {slot === 'attacker' && (
          <ToggleGroup
            variant='outline'
            type='single'
            className='flex flex-col w-full'
            value={attackerMove ?? ''}
            onValueChange={(val) => setAttackerMove(val || null)}
          >
            {mon.selectedMoves
              .filter((move) => move !== null)
              .map((move, i) => (
                <ToggleGroupItem key={i} value={move.name} className='w-full'>
                  {title(move.name)}
                </ToggleGroupItem>
              ))}
          </ToggleGroup>
        )}
      </div>
    );
  };

  return(
    <Dialog
    open={open}
    onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-screen min-w-fit'>
        <DialogHeader>
          <DialogTitle
          className='relative flex justify-center'
          >
          <p
          className='font-extrabold'
          >{resultText}</p>
          </DialogTitle>
        </DialogHeader>
        <div className="container flex justify-between gap-8">
          <div className="flex flex-col flex-1 items-center attacker">
            Attacker
            {renderMonSlot('attacker', attackerId, attacker)}
          </div>

          <div className="flex flex-col items-center justify-center">
            <Button
            variant='ghost'
            size='icon'
            onClick={handleSwap}
            disabled={!attackerId && !defenderId}
            >
              <ArrowLeftRight size={20} />
            </Button>
          </div>

          <div className="field flex-1 flex flex-col items-center">
            Field	
            <ToggleGroup 
            variant='outline'
            type='single'
            value={gameType}
            onValueChange={(val) => {
              if(!val) return;
              setGameType(val as GameType);
            }}
            >
              <ToggleGroupItem value='Singles'>Singles</ToggleGroupItem>
              <ToggleGroupItem value='Doubles'>Doubles</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup 
            variant='outline'
            type='single'
            value={terrain && terrain.length > 0 ? terrain : 'none'}
            onValueChange={(val) => {
              if(!val || val === 'none') setTerrain(null);
              else setTerrain(val as Terrain);
            }}
            >
              <ToggleGroupItem value='none'>None</ToggleGroupItem>
              <ToggleGroupItem value='Electric'>Electric</ToggleGroupItem>
              <ToggleGroupItem value='Grassy'>Grassy</ToggleGroupItem>
              <ToggleGroupItem value='Misty'>Misty</ToggleGroupItem>
              <ToggleGroupItem value='Psychic'>Psychic</ToggleGroupItem>
            </ToggleGroup>
            <Separator className='my-2'/>
            <ToggleGroup 
            variant='outline'
            type='single'
            value={weather && weather.length > 0 ? weather: 'none'}
            onValueChange={(val) => {
              if(!val || val === 'none') setWeather(null);
              else setWeather(val as Weather);
            }}
            >
              <ToggleGroupItem value='none'>None</ToggleGroupItem>
              <ToggleGroupItem value='Sun'>Sun</ToggleGroupItem>
              <ToggleGroupItem value='Rain'>Rain</ToggleGroupItem>
              <ToggleGroupItem value='Sand'>Sand</ToggleGroupItem>
              <ToggleGroupItem value='Snow'>Snow</ToggleGroupItem>
            </ToggleGroup>
            <Toggle 
            variant='outline'
            pressed={isFairyAura}
            onPressedChange={setIsFairyAura}
            >Fairy Aura</Toggle>
            <Toggle 
            variant='outline'
            pressed={isGravity}
            onPressedChange={setIsGravity}
            >Gravity</Toggle>
            <Separator className='my-2'/>
            <Toggle 
            variant='outline'
            pressed={isProtected}
            onPressedChange={setIsProtected}
            >Protect</Toggle>
            <Toggle 
            variant='outline'
            pressed={isHelpingHand}
            onPressedChange={setIsHelpingHand}
            >Helping Hand</Toggle>
            <Toggle 
            variant='outline'
            pressed={isAuroraVeil}
            onPressedChange={setIsAuroraVeil}
            >Aurora Veil</Toggle>
            <ToggleGroup
            variant='outline'
            type='multiple'
            value={screens}
            onValueChange={setScreens}
            >
              <ToggleGroupItem value='reflect'>Reflect</ToggleGroupItem>
              <ToggleGroupItem value='light-screen'>Light Screen</ToggleGroupItem>
            </ToggleGroup>
            <Toggle 
            variant='outline'
            pressed={isTailwind}
            onPressedChange={setIsTailwind}
            >Tailwind</Toggle>
            <Toggle 
            variant='outline'
            pressed={isFriendGuard}
            onPressedChange={setIsFriendGuard}
            >Friend Guard</Toggle>
            <Toggle 
            variant='outline'
            pressed={isStealthRock}
            onPressedChange={setIsStealthRock}
            >Stealth Rock</Toggle>
            <ToggleGroup
            variant='outline'
            type='single'
            value={spikes.toString()}
            onValueChange={(val) => {
              if(!val) setSpikes(0);
              else setSpikes(Number(val));
            }}
            >
              <ToggleGroupItem value='0'>0</ToggleGroupItem>
              <ToggleGroupItem value='1'>1</ToggleGroupItem>
              <ToggleGroupItem value='2'>2</ToggleGroupItem>
              <ToggleGroupItem value='3'>3 spikes</ToggleGroupItem>
            </ToggleGroup>
            <Toggle 
            variant='outline'
            pressed={isSaltCure}
            onPressedChange={setIsSaltCure}
            >Salt Cure</Toggle>
          </div>

          <div className="flex flex-col items-center justify-center">
            <Button
            variant='ghost'
            size='icon'
            onClick={handleSwap}
            disabled={!attackerId && !defenderId}
            >
              <ArrowLeftRight size={20} />
            </Button>
          </div>

          <div className="defender flex-1 flex flex-col items-center">
            Defender
            {renderMonSlot('defender', defenderId, defender)}
          </div>
        </div>
        <BuiltMonsDialog 
        open={addMonSlot !== null}
        onOpenChange={() => setAddMonSlot(null)}
        onSelect={handleSelectMon}
        />
      </DialogContent>
    </Dialog>
  );
}
