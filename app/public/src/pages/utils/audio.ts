import { type Scene } from "phaser"
import { DungeonMusic } from "../../../../types/enum/Dungeon"
import { logger } from "../../../../utils/logger"
import { preferences } from "../../preferences"

export const SOUNDS = {
  BUTTON_CLICK: "buttonclick.ogg",
  BUTTON_HOVER: "buttonhover.ogg",
  CAROUSEL_UNLOCK: "carouselunlock.ogg",
  EVOLUTION_T2: "evolutiont2.ogg",
  EVOLUTION_T3: "evolutiont3.ogg",
  FINISH1: "finish1.ogg",
  FINISH2: "finish2.ogg",
  FINISH3: "finish3.ogg",
  FINISH4: "finish4.ogg",
  FINISH5: "finish5.ogg",
  FINISH6: "finish6.ogg",
  FINISH7: "finish7.ogg",
  FINISH8: "finish8.ogg",
  JOIN_ROOM: "joinroom.ogg",
  LEAVE_ROOM: "leaveroom.ogg",
  REFRESH: "refresh.ogg",
  SET_READY: "setready.ogg",
  START_GAME: "startgame.ogg"
} as const

type Soundkey = (typeof SOUNDS)[keyof typeof SOUNDS]

const AUDIO_ELEMENTS: { [K in Soundkey]?: HTMLAudioElement } = {}

export function preloadSounds() {
  Object.values(SOUNDS).forEach(
    (sound) => (AUDIO_ELEMENTS[sound] = new Audio(`assets/sounds/${sound}`))
  )
}

export function preloadMusic(scene: Scene, dungeonMusic: DungeonMusic) {
  scene.load.audio("music_" + dungeonMusic, [
    `assets/musics/ogg/${dungeonMusic}.ogg`
  ])
}

function setupSounds() {
  document.body.addEventListener("mouseover", (e) => {
    if (e.target instanceof HTMLButtonElement) {
      playSound(SOUNDS.BUTTON_HOVER)
    }
  })
  document.body.addEventListener("click", (e) => {
    if (
      e.target instanceof HTMLButtonElement ||
      (e.target instanceof HTMLElement && e.target.closest("button") != null)
    ) {
      playSound(SOUNDS.BUTTON_CLICK)
    }
  })
}

preloadSounds()
setupSounds()

export function playSound(key: Soundkey, volume = 1) {
  const sound = AUDIO_ELEMENTS[key]
  if (sound) {
    sound.currentTime = 0
    sound.volume = (volume * preferences.sfxVolume) / 100
    sound.play()
  }
}

type SceneWithMusic = Phaser.Scene & { music?: Phaser.Sound.WebAudioSound }

export function playMusic(scene: SceneWithMusic, name: string) {
  if (scene == null || scene.music?.key === "music_" + name) return
  if (scene.music) scene.music.destroy()
  scene.music = scene.sound.add("music_" + name, {
    loop: true
  }) as Phaser.Sound.WebAudioSound
  scene.sound.pauseOnBlur = !preferences.playInBackground;
  const musicVolume = preferences.musicVolume / 100
  try {
    scene.music.play({ volume: musicVolume, loop: true })
  } catch (err) {
    logger.error("can't play music", err)
  }
}
