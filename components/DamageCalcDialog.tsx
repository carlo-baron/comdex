"use client";

import BuiltMonsDialog from "./BuiltMonsDialog";
import { useState } from "react";
import { Plus } from "lucide-react";
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

import {
  GameType,
  Weather,
  Terrain,
} from "@smogon/calc/dist/data/interface";

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
	const [addMon, setAddMon] = useState(false);
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

  return(
    <Dialog
    open={open}
    onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-screen min-w-fit'>
        <DialogHeader>
          <DialogTitle>Damage Calculator</DialogTitle>
        </DialogHeader>
        <div className="container flex justify-between gap-8">
          <div className="flex flex-col flex-1 items-center attacker">
            Attacker
						<div className="flex justify-center items-center outline aspect-square w-30">
							<Button
							variant='outline'
							className='w-full h-full'
							>
								<Plus size={98}/>
							</Button>
						</div>
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
          <div className="defender flex-1 flex flex-col items-center">
            Defender
						<div className="flex justify-center items-center outline aspect-square w-30">
							<Button
							variant='outline'
							className='w-full h-full'
							onClick={() => setAddMon(true)}
							>
								<Plus size={98}/>
							</Button>
						</div>
          </div>
        </div>
				<BuiltMonsDialog 
				open={addMon}
				onOpenChange={() => setAddMon(true)}
				/>
      </DialogContent>
    </Dialog>
  );
}
