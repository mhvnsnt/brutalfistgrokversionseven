import { i as __toESM } from "../_runtime.mjs";
import { I as MathUtils, N as LoopOnce, P as LoopRepeat, U as NearestFilter, dt as Vector3, gt as require_react, ht as require_jsx_runtime, i as AnimationMixer, n as useFrame, o as Box3, t as Canvas } from "../_libs/@react-three/fiber+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as GLTFLoader } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-LrZV7u_-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Shared Bannon -> Brutal Fist combat contract.
* Sourced from Bannon's architecture ledger. Browser runtime is a
* compatibility surface — native Jolt remains physics owner.
*/
var BANNON_COMBAT_CONTRACT = {
	tickRate: 60,
	maxBodyVelocityMps: 3.8,
	damageScale: 8,
	maxHitStopFrames: 5,
	heavyHitStopFrames: 4,
	physicalPinShoulderToleranceM: .15,
	startingHp: 1e4,
	poise: {
		enabled: true,
		zeroBehavior: "full-body-ragdoll"
	},
	rootMotion: {
		bounded: true,
		sweptCollision: true,
		nativeOwner: "C++"
	},
	hitReaction: {
		activeRagdollBlendOnHeavy: 1,
		nativePhysicsOwner: "Jolt"
	}
};
function boundedRootMotionVelocityMetersPerSecond(rawVelocity) {
	if (!Number.isFinite(rawVelocity)) return 0;
	return Math.max(-BANNON_COMBAT_CONTRACT.maxBodyVelocityMps, Math.min(BANNON_COMBAT_CONTRACT.maxBodyVelocityMps, rawVelocity));
}
function hitStopFramesForImpact(force) {
	if (!Number.isFinite(force) || force <= 0) return 0;
	if (force < BANNON_COMBAT_CONTRACT.damageScale * .75) return 0;
	const normalized = Math.min(1, force / (BANNON_COMBAT_CONTRACT.damageScale * 2));
	return Math.max(3, Math.min(BANNON_COMBAT_CONTRACT.maxHitStopFrames, Math.round(3 + normalized * 2)));
}
function isPhysicalPin(leftShoulderDistanceM, rightShoulderDistanceM) {
	return Number.isFinite(leftShoulderDistanceM) && Number.isFinite(rightShoulderDistanceM) && leftShoulderDistanceM <= BANNON_COMBAT_CONTRACT.physicalPinShoulderToleranceM && rightShoulderDistanceM <= BANNON_COMBAT_CONTRACT.physicalPinShoulderToleranceM;
}
/**
* HARD BOUNDARY: only actual Bannon character GLBs are catalogued here.
* NO GLB = NO CHARACTER. A GLB is necessary but not sufficient.
*/
var BANNON_GLB_MODELS = [
	{
		id: "bannon",
		name: "Bannon",
		model: "BANNON.glb",
		rigStatus: "named-part",
		playableGate: "PASS",
		source: "CANON_MODELS"
	},
	{
		id: "bannon",
		name: "Bannon",
		model: "BANNON_muscular.glb",
		attire: "Muscular alt",
		rigStatus: "single-mesh-needs-rigready",
		playableGate: "BLOCKED_RIG",
		source: "CANON_MODELS"
	},
	{
		id: "maime",
		name: "Maime",
		model: "MAIME.glb",
		rigStatus: "named-part",
		playableGate: "PASS",
		source: "CANON_MODELS"
	},
	{
		id: "maime",
		name: "Maime",
		model: "MAIME_tattered.glb",
		attire: "Tattered",
		rigStatus: "named-part",
		playableGate: "PASS",
		source: "CANON_MODELS"
	},
	{
		id: "onyx",
		name: "Onyx",
		model: "ONYX.glb",
		attire: "Chola/Spiked",
		rigStatus: "single-mesh-needs-rigready",
		playableGate: "BLOCKED_RIG",
		source: "CANON_MODELS"
	},
	{
		id: "onyx",
		name: "Onyx",
		model: "ONYX_corset.glb",
		attire: "Corset/Vamp",
		rigStatus: "single-mesh-needs-rigready",
		playableGate: "BLOCKED_RIG",
		source: "CANON_MODELS"
	},
	{
		id: "onyx",
		name: "Onyx",
		model: "ONYX_street.glb",
		attire: "Street",
		rigStatus: "skinned",
		playableGate: "PASS",
		source: "CANON_MODELS"
	},
	{
		id: "onyx",
		name: "Onyx",
		model: "ONYX_straightjacket.glb",
		attire: "Straightjacket",
		rigStatus: "skinned",
		playableGate: "PASS",
		source: "CANON_MODELS"
	},
	{
		id: "cain_elias",
		name: "Cain Elias",
		model: "CAIN_ELIAS_ring.glb",
		attire: "Ring",
		rigStatus: "skinned",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "cain_elias",
		name: "Cain Elias",
		model: "CAIN_ELIAS_snakeskin.glb",
		attire: "Snakeskin",
		rigStatus: "skinned",
		playableGate: "BLOCKED_QA",
		source: "CANON_MODELS"
	},
	{
		id: "cain_elias",
		name: "Cain Elias",
		model: "CAIN_ELIAS_gear.glb",
		attire: "Wrestling Gear",
		rigStatus: "skinned",
		playableGate: "BLOCKED_QA",
		source: "CANON_MODELS"
	},
	{
		id: "cain_elias",
		name: "Cain Elias",
		model: "CAIN_ELIAS_godwithin.glb",
		attire: "God Within",
		rigStatus: "skinned",
		playableGate: "BLOCKED_QA",
		source: "BATCH_RERIG"
	},
	{
		id: "stick_up",
		name: "Stick-Up",
		model: "STICKUP.glb",
		rigStatus: "skinned",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "cipher",
		name: "Cipher",
		model: "CIPHER.glb",
		rigStatus: "skinned",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "cipher",
		name: "Cipher",
		model: "CIPHER_minion.glb",
		attire: "Minion",
		rigStatus: "skinned",
		playableGate: "PASS",
		source: "CANON_MODELS"
	},
	{
		id: "cipher",
		name: "Cipher",
		model: "CIPHER_feral.glb",
		attire: "Feral",
		rigStatus: "skinned",
		playableGate: "PASS",
		source: "CANON_MODELS"
	},
	{
		id: "echo",
		name: "Echo",
		model: "ECHO.glb",
		rigStatus: "skinned",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "cody",
		name: "Cody",
		model: "CODY_sober.glb",
		attire: "Sober",
		rigStatus: "skinned",
		playableGate: "BLOCKED_QA",
		source: "CANON_MODELS"
	},
	{
		id: "cody",
		name: "Cody",
		model: "CODY_stressed.glb",
		attire: "Stressed",
		rigStatus: "skinned",
		playableGate: "BLOCKED_QA",
		source: "CANON_MODELS"
	},
	{
		id: "hall_nighter",
		name: "Hall Nighter",
		model: "HALL_NIGHTER.glb",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "static",
		name: "Static",
		model: "STATIC.glb",
		attire: "Default",
		rigStatus: "skinned",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "static",
		name: "Static",
		model: "STATIC_alt.glb",
		attire: "Alt",
		rigStatus: "skinned",
		playableGate: "BLOCKED_QA",
		source: "CANON_MODELS"
	},
	{
		id: "viper",
		name: "Viper",
		model: "VIPER.glb",
		rigStatus: "skinned",
		playableGate: "PASS",
		source: "MODEL_QA"
	},
	{
		id: "kobra",
		name: "Kobra",
		model: "KOBRA.glb",
		rigStatus: "skinned",
		playableGate: "PASS",
		source: "MODEL_QA"
	},
	{
		id: "aaron_ruben",
		name: "Aaron Ruben",
		model: "AARON_RUBEN.glb",
		rigStatus: "skinned",
		playableGate: "PASS",
		source: "MODEL_QA"
	},
	{
		id: "hollow",
		name: "Hollow",
		model: "HOLLOW.glb",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "edwin_kennedy",
		name: "Edwin Kennedy",
		model: "EDWIN_KENNEDY.glb",
		attire: "Mustached Mogul / attire 1",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "edwin_kennedy",
		name: "Edwin Kennedy",
		model: "EDWIN_KENNEDY_unchained.glb",
		attire: "Unchained / attire 3",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "BATCH_RERIG"
	},
	{
		id: "pablo",
		name: "Pablo",
		model: "PABLO.glb",
		attire: "Minotaur Painted / attire 1",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "pablo",
		name: "Pablo",
		model: "PABLO_goldenbull.glb",
		attire: "Golden Bull / attire 2",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "BATCH_RERIG"
	},
	{
		id: "pablo",
		name: "Pablo",
		model: "PABLO_blackreign.glb",
		attire: "Black Reign / attire 3",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "BATCH_RERIG"
	},
	{
		id: "tyneshia",
		name: "Tyneshia",
		model: "TYNESHIA.glb",
		attire: "Wrestling Gear / attire 1",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "tyneshia",
		name: "Tyneshia",
		model: "TYNESHIA_street.glb",
		attire: "Hall Street Gear / Casual / Manager / attire 2",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "BATCH_RERIG"
	},
	{
		id: "triple_xxx",
		name: "Triple XXX",
		model: "TRIPLE_XXX.glb",
		attire: "attire 1",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "triple_xxx",
		name: "Triple XXX",
		model: "TRIPLE_XXX_tights.glb",
		attire: "Blue Tights / attire 2",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "BATCH_RERIG"
	},
	{
		id: "triple_xxx",
		name: "Triple XXX",
		model: "TRIPLE_XXX_trunks.glb",
		attire: "Blue Trunks / attire 3",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "BATCH_RERIG"
	},
	{
		id: "triple_xxx",
		name: "Triple XXX",
		model: "TRIPLE_XXX_suit.glb",
		attire: "Suit / Casual / Manager / attire 4",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "BATCH_RERIG"
	},
	{
		id: "el_toro_de_oro",
		name: "El Toro de Oro",
		model: "EL_TORO_DE_ORO.glb",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "stan_combs",
		name: "Stan Combs",
		model: "STAN_COMBS_gear.glb",
		attire: "Ring Gear",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "brutus",
		name: "Brutus",
		model: "BRUTUS.glb",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "titan",
		name: "Titan",
		model: "TITAN.glb",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "master_sensei",
		name: "Master Sensei",
		model: "MASTER_SENSEI.glb",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	},
	{
		id: "wreck_patterson",
		name: "Wreck Patterson",
		model: "WRECK_PATTERSON.glb",
		rigStatus: "qa-weak",
		playableGate: "BLOCKED_QA",
		source: "MODEL_QA"
	}
];
var BANNON_GLB_PLAYABLE_MODELS = BANNON_GLB_MODELS.filter((e) => e.playableGate === "PASS");
var BANNON_GLB_BLOCKED_MODELS = BANNON_GLB_MODELS.filter((e) => e.playableGate !== "PASS");
function glbPublicUrl(model) {
	return `/fighters/${model}`;
}
/**
* Fighter data is downstream of the GLB-backed identity.
* Stats/bios are only attached to PASS-gated GLB models.
* Do not invent lore — identity comes from Bannon source records.
*/
var PROFILE_CORE = {
	bannon: {
		id: "bannon",
		dna: "BANNON_V1_CORE",
		role: "Wrestler",
		poise: 95,
		hp: BANNON_COMBAT_CONTRACT.startingHp,
		speed: 85,
		strength: 90,
		physicsScale: 1.1,
		payback: "Beast Mode",
		manager: "None",
		style: "Power wrestling",
		bio: "The physical nucleus and absolute force of the Bannon Engine."
	},
	maime: {
		id: "maime",
		dna: "MAIME",
		role: "Wrestler",
		poise: 85,
		hp: BANNON_COMBAT_CONTRACT.startingHp,
		speed: 90,
		strength: 78,
		physicsScale: 1,
		payback: "TBD",
		manager: "None",
		style: "Striking wrestler",
		bio: "Bannon GLB-backed fighter."
	},
	onyx: {
		id: "onyx",
		dna: "ONYX",
		role: "Wrestler",
		poise: 90,
		hp: BANNON_COMBAT_CONTRACT.startingHp,
		speed: 88,
		strength: 86,
		physicsScale: 1,
		payback: "TBD",
		manager: "None",
		style: "Brawler",
		bio: "Bannon GLB-backed fighter."
	},
	cipher: {
		id: "cipher",
		dna: "CIPHER",
		role: "Wrestler",
		poise: 88,
		hp: BANNON_COMBAT_CONTRACT.startingHp,
		speed: 93,
		strength: 80,
		physicsScale: 1,
		payback: "TBD",
		manager: "None",
		style: "High-speed striker",
		bio: "Bannon GLB-backed fighter."
	},
	viper: {
		id: "viper",
		dna: "VIPER",
		role: "Wrestler",
		poise: 86,
		hp: BANNON_COMBAT_CONTRACT.startingHp,
		speed: 92,
		strength: 82,
		physicsScale: 1,
		payback: "TBD",
		manager: "None",
		style: "Counter wrestler",
		bio: "Bannon GLB-backed fighter."
	},
	kobra: {
		id: "kobra",
		dna: "KOBRA",
		role: "Wrestler",
		poise: 87,
		hp: BANNON_COMBAT_CONTRACT.startingHp,
		speed: 91,
		strength: 84,
		physicsScale: 1,
		payback: "TBD",
		manager: "None",
		style: "Submission striker",
		bio: "Bannon GLB-backed fighter."
	},
	aaron_ruben: {
		id: "aaron_ruben",
		dna: "AARON_RUBEN",
		role: "Wrestler",
		poise: 91,
		hp: BANNON_COMBAT_CONTRACT.startingHp,
		speed: 80,
		strength: 92,
		physicsScale: 1.05,
		payback: "TBD",
		manager: "None",
		style: "Heavy grappler",
		bio: "Bannon GLB-backed fighter."
	}
};
function profileFromGlb(entry) {
	if (entry.playableGate !== "PASS") return null;
	const core = PROFILE_CORE[entry.id];
	if (!core) return null;
	return {
		...core,
		name: entry.name,
		model: entry.model,
		attire: entry.attire,
		rigStatus: entry.rigStatus,
		playableGate: "PASS"
	};
}
var BANNON_PLAYABLE_ROSTER = BANNON_GLB_PLAYABLE_MODELS.map(profileFromGlb).filter((p) => p !== null);
var STAGES = [
	{
		id: "iron-pit",
		name: "IRON PIT",
		subtitle: "Abandoned foundry floor",
		boundsX: 5.5,
		boundsZ: 2.35,
		spawnX: 2.2,
		floorColor: "#2a2620",
		wallColor: "#1a1612",
		accentColor: "#6a3a28",
		fogColor: "#12100e",
		skyColor: "#0e0c0a",
		ambient: .55,
		keyLight: 2.4,
		fillLight: .7,
		kind: "warehouse"
	},
	{
		id: "hall-ring",
		name: "HALL STREET",
		subtitle: "Four ropes, no mercy",
		boundsX: 4.6,
		boundsZ: 2.1,
		spawnX: 1.85,
		floorColor: "#1c2420",
		wallColor: "#141816",
		accentColor: "#8a8a86",
		fogColor: "#101412",
		skyColor: "#0c1010",
		ambient: .7,
		keyLight: 2.8,
		fillLight: .9,
		kind: "ring"
	},
	{
		id: "night-roof",
		name: "NIGHT ROOF",
		subtitle: "City edge, open sky",
		boundsX: 5.8,
		boundsZ: 2.5,
		spawnX: 2.35,
		floorColor: "#242428",
		wallColor: "#16161c",
		accentColor: "#3a4250",
		fogColor: "#0a0c14",
		skyColor: "#080a12",
		ambient: .45,
		keyLight: 1.8,
		fillLight: .55,
		kind: "rooftop"
	},
	{
		id: "training-gym",
		name: "TRAINING GYM",
		subtitle: "Mats, lights, repetition",
		boundsX: 5.2,
		boundsZ: 2.2,
		spawnX: 2.05,
		floorColor: "#2c2418",
		wallColor: "#1c1814",
		accentColor: "#5a5044",
		fogColor: "#141210",
		skyColor: "#12100e",
		ambient: .85,
		keyLight: 2.2,
		fillLight: 1.1,
		kind: "gym"
	}
];
function getStage(id) {
	return STAGES.find((s) => s.id === id) ?? STAGES[0];
}
var DEFAULT_SETTINGS = {
	graphics: "PS1_3D",
	master: .8,
	music: .45,
	sfx: .85,
	cameraShake: true
};
var SETTINGS_KEY = "brutal-fist-settings";
function loadSettings() {
	if (typeof window === "undefined") return DEFAULT_SETTINGS;
	try {
		const raw = window.localStorage.getItem(SETTINGS_KEY);
		if (!raw) return DEFAULT_SETTINGS;
		const parsed = JSON.parse(raw);
		return {
			...DEFAULT_SETTINGS,
			...parsed,
			graphics: parsed.graphics === "RETRO8" ? "RETRO8" : "PS1_3D"
		};
	} catch {
		return DEFAULT_SETTINGS;
	}
}
function saveSettings(settings) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
function nextArcadeOpponent(p1, index) {
	const others = BANNON_PLAYABLE_ROSTER.filter((f) => f.model !== p1.model);
	if (!others.length) return BANNON_PLAYABLE_ROSTER[0];
	return others[index % others.length];
}
var useGameStore = create()((set, get) => ({
	screen: "boot",
	mode: "versus",
	selecting: "p1",
	p1: BANNON_PLAYABLE_ROSTER[0] ?? null,
	p2: BANNON_PLAYABLE_ROSTER[1] ?? BANNON_PLAYABLE_ROSTER[0] ?? null,
	stageId: STAGES[0].id,
	arcadeIndex: 0,
	arcadeWins: 0,
	lastWinner: null,
	dummyBehavior: "stand",
	paused: false,
	settings: DEFAULT_SETTINGS,
	setScreen: (screen) => set({
		screen,
		paused: false
	}),
	setMode: (mode) => set({ mode }),
	setSelecting: (slot) => set({ selecting: slot }),
	setFighter: (slot, fighter) => set({ [slot]: fighter }),
	setStage: (id) => set({ stageId: id }),
	setDummy: (behavior) => set({ dummyBehavior: behavior }),
	setPaused: (paused) => set({ paused }),
	patchSettings: (patch) => {
		const settings = {
			...get().settings,
			...patch
		};
		saveSettings(settings);
		set({ settings });
	},
	beginMode: (mode) => set({
		mode,
		selecting: "p1",
		screen: "select",
		arcadeIndex: 0,
		arcadeWins: 0,
		lastWinner: null,
		paused: false
	}),
	confirmSelect: () => {
		const { mode, selecting, p1 } = get();
		if (mode === "versus" && selecting === "p1") {
			set({
				selecting: "p2",
				screen: "select"
			});
			return;
		}
		if (mode === "arcade" && p1) {
			set({
				p2: nextArcadeOpponent(p1, 0),
				arcadeIndex: 0,
				screen: "details"
			});
			return;
		}
		set({ screen: "details" });
	},
	confirmDetails: () => set({ screen: "stage" }),
	confirmStage: () => set({ screen: "versus" }),
	fightersReady: () => set({
		screen: "combat",
		paused: false
	}),
	matchFinished: (winner) => {
		const { mode, arcadeWins } = get();
		set({
			lastWinner: winner,
			paused: false,
			screen: "result",
			arcadeWins: mode === "arcade" && winner === "p1" ? arcadeWins + 1 : arcadeWins
		});
	},
	rematch: () => set({
		screen: "versus",
		paused: false,
		lastWinner: null
	}),
	nextArcade: () => {
		const { p1, arcadeIndex } = get();
		if (!p1) return;
		const next = arcadeIndex + 1;
		const ladder = BANNON_PLAYABLE_ROSTER.filter((f) => f.model !== p1.model);
		if (next >= Math.min(5, ladder.length)) {
			set({ screen: "arcade-end" });
			return;
		}
		set({
			arcadeIndex: next,
			p2: nextArcadeOpponent(p1, next),
			screen: "versus",
			lastWinner: null
		});
	},
	backToMenu: () => set({
		screen: "menu",
		paused: false,
		selecting: "p1",
		lastWinner: null
	}),
	backToSelect: () => set({
		screen: "select",
		selecting: "p1",
		paused: false,
		lastWinner: null
	})
}));
var FighterState = /* @__PURE__ */ function(FighterState) {
	FighterState["Neutral"] = "Neutral";
	FighterState["Crouch"] = "Crouch";
	FighterState["Startup"] = "Startup";
	FighterState["Active"] = "Active";
	FighterState["Recovery"] = "Recovery";
	FighterState["Hitstun"] = "Hitstun";
	FighterState["Blockstun"] = "Blockstun";
	FighterState["Grappled"] = "Grappled";
	FighterState["Pinned"] = "Pinned";
	FighterState["Knockdown"] = "Knockdown";
	FighterState["Wake"] = "Wake";
	FighterState["KO"] = "KO";
	return FighterState;
}({});
var EMPTY_INPUT = {
	up: false,
	down: false,
	left: false,
	right: false,
	light: false,
	heavy: false,
	guard: false,
	crouch: false,
	grapple: false,
	escape: false,
	pin: false
};
var BRUTAL_FIST_MOVE_CATALOG = {
	light: {
		id: "bf_light",
		displayName: "Light",
		startup: 4,
		active: 3,
		recovery: 10,
		damage: 70,
		hitAdvantage: 4,
		blockAdvantage: -2,
		pushback: .55,
		hitstun: 14,
		blockstun: 9,
		animation: "light",
		animationAliases: [
			"light",
			"Light",
			"punch",
			"Punch",
			"attack",
			"Attack"
		],
		minRange: .15,
		maxRange: 2.05,
		priority: 10,
		low: false,
		mid: true,
		throw: false,
		canCancel: true,
		hitbox: {
			offsetX: .82,
			offsetZ: 0,
			width: 1.05,
			depth: .62,
			damage: 70,
			hitstun: 14,
			blockstun: 9,
			pushback: .55,
			launch: 0
		}
	},
	heavy: {
		id: "bf_heavy",
		displayName: "Heavy",
		startup: 12,
		active: 4,
		recovery: 20,
		damage: 155,
		hitAdvantage: 2,
		blockAdvantage: -6,
		pushback: 1.05,
		hitstun: 24,
		blockstun: 13,
		animation: "heavy",
		animationAliases: [
			"heavy",
			"Heavy",
			"strong",
			"Strong",
			"heavy_attack"
		],
		minRange: .25,
		maxRange: 2.4,
		priority: 20,
		low: false,
		mid: true,
		throw: false,
		canCancel: false,
		hitbox: {
			offsetX: 1,
			offsetZ: 0,
			width: 1.25,
			depth: .72,
			damage: 155,
			hitstun: 24,
			blockstun: 13,
			pushback: 1.05,
			launch: .22
		}
	}
};
function getMove(id) {
	return BRUTAL_FIST_MOVE_CATALOG[id];
}
var GrappleSystem = class {
	state = {
		phase: "none",
		attackerId: null,
		defenderId: null,
		frame: 0,
		escapeMeter: 0
	};
	getState() {
		return { ...this.state };
	}
	canEngage(distanceM, defenderGuarding) {
		return Number.isFinite(distanceM) && distanceM >= .2 && distanceM <= .95 && !defenderGuarding && this.state.phase === "none";
	}
	engage(attackerId, defenderId, frame) {
		if (this.state.phase !== "none") return false;
		this.state = {
			phase: "engaged",
			attackerId,
			defenderId,
			frame,
			escapeMeter: 0
		};
		return true;
	}
	advanceControl(frame) {
		if (this.state.phase !== "engaged" && this.state.phase !== "control") return;
		this.state.phase = "control";
		this.state.frame = frame;
	}
	applyEscapeInput(amount, frame) {
		if (this.state.phase !== "engaged" && this.state.phase !== "control") return false;
		this.state.escapeMeter = Math.max(0, Math.min(100, this.state.escapeMeter + Math.max(0, amount)));
		this.state.frame = frame;
		if (this.state.escapeMeter >= 100) {
			this.state.phase = "escaped";
			return true;
		}
		return false;
	}
	attemptPin(frame, measurement) {
		if (this.state.phase !== "control" && this.state.phase !== "throw") return false;
		const valid = measurement.ringMatContact && isPhysicalPin(measurement.leftShoulderDistanceM, measurement.rightShoulderDistanceM);
		this.state.phase = valid ? "pinned" : "control";
		this.state.frame = frame;
		return valid;
	}
	startThrow(frame) {
		if (this.state.phase !== "control" && this.state.phase !== "engaged") return false;
		this.state.phase = "throw";
		this.state.frame = frame;
		return true;
	}
	release(frame) {
		this.state = {
			phase: "none",
			attackerId: null,
			defenderId: null,
			frame,
			escapeMeter: 0
		};
	}
	getContract() {
		return {
			maxVelocityMps: BANNON_COMBAT_CONTRACT.maxBodyVelocityMps,
			pinToleranceM: BANNON_COMBAT_CONTRACT.physicalPinShoulderToleranceM,
			nativePhysicsOwner: BANNON_COMBAT_CONTRACT.hitReaction.nativePhysicsOwner
		};
	}
};
var DEFAULT_HURTBOX = {
	offsetX: 0,
	offsetZ: 0,
	width: .82,
	depth: .72
};
var LIGHT = getMove("light");
var HEAVY = getMove("heavy");
var INTRO_FRAMES = 90;
var ROUND_END_FRAMES = 110;
var ROUND_TIME_FRAMES = 5940;
var KNOCKDOWN_FRAMES = 42;
var WAKE_FRAMES = 22;
var PIN_WIN_FRAMES = 90;
var ROUNDS_TO_WIN = 2;
var GameEngine = class {
	currentFrame = 0;
	phase = "intro";
	round = 1;
	timerFrames = ROUND_TIME_FRAMES;
	hitStopFrames = 0;
	lastResult = null;
	winner = null;
	grapple = new GrappleSystem();
	config;
	p1;
	p2;
	phaseFrames = 0;
	pinHold = 0;
	paused = false;
	hurtbox = DEFAULT_HURTBOX;
	p1Pressed = {
		light: false,
		heavy: false,
		grapple: false,
		pin: false
	};
	p2Pressed = {
		light: false,
		heavy: false,
		grapple: false,
		pin: false
	};
	constructor(config) {
		this.config = config;
		this.p1 = this.makeFighter(config.p1, -config.stage.spawnX);
		this.p2 = this.makeFighter(config.p2, config.stage.spawnX);
		this.p1.facing = 1;
		this.p2.facing = -1;
	}
	setPaused(value) {
		this.paused = value;
	}
	setDummyBehavior(behavior) {
		this.config.dummyBehavior = behavior;
	}
	resetTraining() {
		this.currentFrame = 0;
		this.phase = "intro";
		this.phaseFrames = 0;
		this.round = 1;
		this.timerFrames = ROUND_TIME_FRAMES;
		this.hitStopFrames = 0;
		this.lastResult = null;
		this.winner = null;
		this.pinHold = 0;
		this.grapple.release(0);
		this.p1 = this.makeFighter(this.config.p1, -this.config.stage.spawnX);
		this.p2 = this.makeFighter(this.config.p2, this.config.stage.spawnX);
		this.p1.facing = 1;
		this.p2.facing = -1;
	}
	resetPositions() {
		this.p1.x = -this.config.stage.spawnX;
		this.p1.z = 0;
		this.p2.x = this.config.stage.spawnX;
		this.p2.z = 0;
		this.p1.state = FighterState.Neutral;
		this.p2.state = FighterState.Neutral;
		this.p1.move = null;
		this.p2.move = null;
		this.p1.animation = "idle";
		this.p2.animation = "idle";
		this.grapple.release(this.currentFrame);
	}
	resetHealth() {
		this.p1.health = this.p1.profile.hp;
		this.p2.health = this.p2.profile.hp;
		this.p1.poise = this.p1.profile.poise;
		this.p2.poise = this.p2.profile.poise;
	}
	tick(p1Input, p2Input = EMPTY_INPUT) {
		if (this.paused) return;
		if (this.phase === "matchOver") return;
		this.currentFrame++;
		this.phaseFrames++;
		if (this.phase === "intro") {
			this.updateFacing();
			this.p1.animation = "idle";
			this.p2.animation = "idle";
			if (this.phaseFrames >= INTRO_FRAMES) {
				this.phase = "fight";
				this.phaseFrames = 0;
			}
			return;
		}
		if (this.phase === "roundEnd") {
			if (this.phaseFrames >= ROUND_END_FRAMES) this.beginNextRound();
			return;
		}
		if (this.hitStopFrames > 0) {
			this.hitStopFrames--;
			return;
		}
		const cpuInput = this.config.cpuP2 ? this.thinkCpu() : p2Input;
		this.updateFacing();
		this.updateGrapple(p1Input, cpuInput);
		const g = this.grapple.getState();
		if (g.phase !== "none" && g.phase !== "escaped") {
			this.updateGrappledStates();
			this.edgePressed(p1Input, cpuInput);
			return;
		}
		if (g.phase === "escaped") this.grapple.release(this.currentFrame);
		this.simulateFighter("p1", this.p1, p1Input, this.p1Pressed);
		this.simulateFighter("p2", this.p2, cpuInput, this.p2Pressed);
		this.resolveBodySeparation();
		this.updateFacing();
		this.tickTimer();
		this.edgePressed(p1Input, cpuInput);
	}
	getSnapshot() {
		const g = this.grapple.getState();
		return {
			frame: this.currentFrame,
			phase: this.phase,
			round: this.round,
			roundsToWin: ROUNDS_TO_WIN,
			timerFrames: this.timerFrames,
			timerSeconds: Math.max(0, Math.ceil(this.timerFrames / 60)),
			hitStopFrames: this.hitStopFrames,
			p1: this.snapshot(this.p1),
			p2: this.snapshot(this.p2),
			grapplePhase: g.phase,
			grappleEscapeMeter: g.escapeMeter,
			lastResult: this.lastResult,
			winner: this.winner
		};
	}
	getP1() {
		return this.p1;
	}
	getP2() {
		return this.p2;
	}
	makeFighter(profile, x) {
		return {
			profile,
			health: profile.hp,
			poise: profile.poise,
			x,
			z: 0,
			facing: x < 0 ? 1 : -1,
			state: FighterState.Neutral,
			stateFrame: 0,
			animation: "idle",
			move: null,
			hitstun: 0,
			blockstun: 0,
			knockdown: 0,
			wake: 0,
			guard: false,
			crouch: false,
			roundsWon: 0,
			edgeVx: 0
		};
	}
	snapshot(f) {
		return {
			health: f.health,
			maxHealth: f.profile.hp,
			poise: f.poise,
			maxPoise: f.profile.poise,
			x: f.x,
			z: f.z,
			facing: f.facing,
			state: f.state,
			stateFrame: f.stateFrame,
			animation: f.animation,
			move: f.move,
			guarding: f.guard,
			crouching: f.crouch,
			roundsWon: f.roundsWon
		};
	}
	edgePressed(p1, p2) {
		this.p1Pressed = {
			light: p1.light,
			heavy: p1.heavy,
			grapple: p1.grapple,
			pin: p1.pin
		};
		this.p2Pressed = {
			light: p2.light,
			heavy: p2.heavy,
			grapple: p2.grapple,
			pin: p2.pin
		};
	}
	justPressed(side, key, input) {
		const prev = side === "p1" ? this.p1Pressed : this.p2Pressed;
		return input[key] && !prev[key];
	}
	updateGrapple(p1Input, p2Input) {
		const g = this.grapple.getState();
		const distance = Math.hypot(this.p2.x - this.p1.x, this.p2.z - this.p1.z);
		if (g.phase === "none") {
			if (this.justPressed("p1", "grapple", p1Input) && this.p1.state === FighterState.Neutral && this.p2.state === FighterState.Neutral && this.grapple.canEngage(distance, this.p2.guard)) {
				this.grapple.engage("p1", "p2", this.currentFrame);
				return;
			}
			if (this.justPressed("p2", "grapple", p2Input) && this.p2.state === FighterState.Neutral && this.p1.state === FighterState.Neutral && this.grapple.canEngage(distance, this.p1.guard)) this.grapple.engage("p2", "p1", this.currentFrame);
			return;
		}
		if (g.phase === "engaged" || g.phase === "control") {
			const defenderInput = g.defenderId === "p2" ? p2Input : p1Input;
			const attackerInput = g.attackerId === "p1" ? p1Input : p2Input;
			if (defenderInput.escape) this.grapple.applyEscapeInput(9, this.currentFrame);
			else this.grapple.advanceControl(this.currentFrame);
			if (this.justPressed(g.attackerId === "p1" ? "p1" : "p2", "pin", attackerInput)) this.grapple.attemptPin(this.currentFrame, this.measurePinContact());
			else if (this.justPressed(g.attackerId === "p1" ? "p1" : "p2", "heavy", attackerInput)) this.executeThrow(g.attackerId === "p1" ? "p1" : "p2");
		}
	}
	executeThrow(attacker) {
		this.grapple.startThrow(this.currentFrame);
		const atk = attacker === "p1" ? this.p1 : this.p2;
		const def = attacker === "p1" ? this.p2 : this.p1;
		const damage = this.scaledDamage(180, atk.profile);
		def.health = Math.max(0, def.health - damage);
		def.poise = Math.max(0, def.poise - 18);
		def.state = FighterState.Hitstun;
		def.hitstun = 28;
		def.animation = "hit";
		atk.animation = "throw";
		def.x += atk.facing * 1.35;
		this.hitStopFrames = BANNON_COMBAT_CONTRACT.heavyHitStopFrames;
		this.grapple.release(this.currentFrame);
		this.clamp(def);
		if (def.health <= 0) this.knockOut(attacker === "p1" ? "p2" : "p1");
		else if (def.poise <= 0) this.knockDown(attacker === "p1" ? "p2" : "p1");
	}
	updateGrappledStates() {
		const g = this.grapple.getState();
		const atk = g.attackerId === "p1" ? this.p1 : this.p2;
		const def = g.defenderId === "p2" ? this.p2 : this.p1;
		atk.state = FighterState.Grappled;
		def.state = FighterState.Grappled;
		atk.animation = g.phase === "pinned" ? "pin" : "grapple";
		def.animation = g.phase === "pinned" ? "pin" : "grapple";
		const mid = (this.p1.x + this.p2.x) * .5;
		atk.x += (mid - atk.facing * .42 - atk.x) * .2;
		def.x += (mid + atk.facing * .42 - def.x) * .2;
		if (g.phase === "pinned") {
			def.state = FighterState.Pinned;
			this.pinHold++;
			if (this.pinHold >= PIN_WIN_FRAMES && !this.config.training) this.endRound(g.attackerId === "p1" ? "p1" : "p2");
		} else this.pinHold = 0;
	}
	measurePinContact() {
		const distance = Math.hypot(this.p2.x - this.p1.x, this.p2.z - this.p1.z);
		const ringMatContact = Math.abs(this.p2.x) <= this.config.stage.boundsX && Math.abs(this.p2.z) <= this.config.stage.boundsZ;
		const shoulderDistance = Math.max(0, distance - .15);
		return {
			leftShoulderDistanceM: shoulderDistance,
			rightShoulderDistanceM: shoulderDistance,
			ringMatContact
		};
	}
	simulateFighter(side, f, input, _prev) {
		if (f.health <= 0) {
			f.state = FighterState.KO;
			f.animation = "ko";
			return;
		}
		if (f.knockdown > 0) {
			f.knockdown--;
			f.state = FighterState.Knockdown;
			f.animation = "knockdown";
			if (f.knockdown === 0) {
				f.wake = WAKE_FRAMES;
				f.state = FighterState.Wake;
				f.animation = "wake";
				f.poise = Math.max(12, Math.round(f.profile.poise * .45));
			}
			return;
		}
		if (f.wake > 0) {
			f.wake--;
			f.state = FighterState.Wake;
			f.animation = "wake";
			if (!f.wake) f.state = FighterState.Neutral;
			return;
		}
		if (f.hitstun > 0) {
			f.hitstun--;
			f.state = FighterState.Hitstun;
			f.animation = "hit";
			f.x += f.edgeVx;
			f.edgeVx *= .82;
			this.clamp(f);
			if (!f.hitstun) f.state = FighterState.Neutral;
			return;
		}
		if (f.blockstun > 0) {
			f.blockstun--;
			f.state = FighterState.Blockstun;
			f.animation = "block";
			if (!f.blockstun) f.state = FighterState.Neutral;
			return;
		}
		if (f.move) {
			f.stateFrame++;
			if (f.state === FighterState.Startup && f.stateFrame >= f.move.startup) {
				f.state = FighterState.Active;
				f.stateFrame = 0;
			} else if (f.state === FighterState.Active) {
				if (f.stateFrame === 1) this.tryHit(side, f.move);
				if (f.stateFrame >= f.move.active) {
					f.state = FighterState.Recovery;
					f.stateFrame = 0;
				}
			} else if (f.state === FighterState.Recovery && f.stateFrame >= f.move.recovery) {
				f.state = FighterState.Neutral;
				f.stateFrame = 0;
				f.move = null;
			}
			f.animation = f.move?.animation ?? "light";
			return;
		}
		if (f.state !== FighterState.Neutral && f.state !== FighterState.Crouch) return;
		f.guard = input.guard;
		f.crouch = input.crouch || input.down && !input.left && !input.right && !input.up;
		if (f.guard) {
			f.state = FighterState.Neutral;
			f.animation = "guard";
			return;
		}
		if (f.crouch) {
			f.state = FighterState.Crouch;
			f.animation = "crouch";
			return;
		}
		f.state = FighterState.Neutral;
		if (this.justPressed(side, "light", input) && this.canStartMove(f, LIGHT)) {
			this.startMove(f, LIGHT);
			return;
		}
		if (this.justPressed(side, "heavy", input) && this.canStartMove(f, HEAVY)) {
			this.startMove(f, HEAVY);
			return;
		}
		this.moveFighter(f, input);
		f.animation = input.left || input.right || input.up || input.down ? "walk" : "idle";
	}
	startMove(f, move) {
		f.move = {
			...move,
			damage: this.scaledDamage(move.damage, f.profile)
		};
		f.state = FighterState.Startup;
		f.stateFrame = 0;
		f.animation = move.animation ?? "light";
	}
	canStartMove(f, move) {
		const candidate = move;
		if (!candidate) return false;
		const other = f === this.p1 ? this.p2 : this.p1;
		const distance = Math.hypot(other.x - f.x, other.z - f.z);
		return distance >= candidate.minRange && distance <= candidate.maxRange;
	}
	moveFighter(f, input) {
		const max = BANNON_COMBAT_CONTRACT.maxBodyVelocityMps;
		const walk = boundedRootMotionVelocityMetersPerSecond(max * (f.profile.speed / 85)) / 60;
		const side = walk * .72;
		if (input.left) f.x -= walk;
		if (input.right) f.x += walk;
		if (input.up) f.z -= side;
		if (input.down && !f.crouch) f.z += side;
		this.clamp(f);
	}
	thinkCpu() {
		const input = { ...EMPTY_INPUT };
		if (this.config.training) {
			if (this.config.dummyBehavior === "guard") input.guard = true;
			if (this.config.dummyBehavior === "stand") return input;
		}
		const dx = this.p1.x - this.p2.x;
		const dz = this.p1.z - this.p2.z;
		const distance = Math.hypot(dx, dz);
		const aggression = this.config.training && this.config.dummyBehavior === "attack" ? .85 : .42 + this.round * .08;
		if (this.p2.state !== FighterState.Neutral && this.p2.state !== FighterState.Crouch) return input;
		if (this.p1.move && this.p1.state === FighterState.Startup && distance < 1.8 && Math.random() < .35) {
			input.guard = true;
			return input;
		}
		if (distance > 1.85) {
			if (dx > .08) input.right = true;
			if (dx < -.08) input.left = true;
			if (Math.abs(dz) > .12) {
				if (dz > 0) input.down = true;
				else input.up = true;
			}
		} else if (Math.random() < aggression) {
			if (distance <= .9 && Math.random() < .22) input.grapple = true;
			else if (Math.random() < .38) input.heavy = true;
			else input.light = true;
		} else if (Math.random() < .18) input.guard = true;
		return input;
	}
	scaledDamage(base, fighter) {
		return Math.max(1, Math.round(base * BANNON_COMBAT_CONTRACT.damageScale * (fighter.strength / 90)));
	}
	tryHit(side, move) {
		const attacker = side === "p1" ? this.p1 : this.p2;
		const defender = side === "p1" ? this.p2 : this.p1;
		const hitbox = move.hitbox ?? this.legacyHitbox(move);
		const centerX = attacker.x + attacker.facing * hitbox.offsetX;
		const centerZ = attacker.z + hitbox.offsetZ;
		const xOverlap = Math.abs(centerX - defender.x) <= (hitbox.width + this.hurtbox.width) * .5;
		const zOverlap = Math.abs(centerZ - defender.z) <= (hitbox.depth + this.hurtbox.depth) * .5;
		if (!xOverlap || !zOverlap) return;
		if (defender.state === FighterState.Knockdown || defender.state === FighterState.Wake || defender.state === FighterState.KO) return;
		const damage = this.scaledDamage(hitbox.damage || move.damage, attacker.profile);
		const push = hitbox.pushback || move.pushback;
		const blocked = defender.guard && defender.state !== FighterState.Startup && defender.state !== FighterState.Active;
		if (blocked) {
			defender.health = Math.max(0, defender.health - Math.round(damage * .12));
			defender.state = FighterState.Blockstun;
			defender.animation = "block";
			defender.blockstun = hitbox.blockstun || move.blockstun || 9;
			defender.x += attacker.facing * push * .45;
		} else {
			defender.health = Math.max(0, defender.health - damage);
			defender.state = FighterState.Hitstun;
			defender.animation = "hit";
			defender.hitstun = hitbox.hitstun || move.hitstun || 15;
			defender.poise = Math.max(0, defender.poise - Math.max(4, Math.round(damage / 90)));
			defender.x += attacker.facing * push;
			defender.edgeVx = attacker.facing * push * .12;
		}
		this.hitStopFrames = Math.max(this.hitStopFrames, blocked ? 2 : hitStopFramesForImpact(damage / 80));
		this.clamp(defender);
		if (defender.health <= 0) this.knockOut(side === "p1" ? "p2" : "p1");
		else if (!blocked && defender.poise <= 0) this.knockDown(side === "p1" ? "p2" : "p1");
	}
	knockDown(side) {
		const f = side === "p1" ? this.p1 : this.p2;
		if (f.health <= 0) return this.knockOut(side);
		f.state = FighterState.Knockdown;
		f.animation = "knockdown";
		f.knockdown = KNOCKDOWN_FRAMES;
		f.move = null;
		f.hitstun = 0;
		f.poise = 0;
	}
	knockOut(side) {
		const f = side === "p1" ? this.p1 : this.p2;
		f.health = 0;
		f.state = FighterState.KO;
		f.animation = "ko";
		f.move = null;
		if (this.config.training) return;
		this.endRound(side === "p1" ? "p2" : "p1");
	}
	tickTimer() {
		if (this.config.training || this.phase !== "fight") return;
		this.timerFrames--;
		if (this.timerFrames <= 0) {
			if (this.p1.health === this.p2.health) this.endRound("draw");
			else this.endRound(this.p1.health > this.p2.health ? "p1" : "p2");
		}
	}
	endRound(result) {
		if (this.phase !== "fight") return;
		this.lastResult = result;
		if (result === "p1") this.p1.roundsWon++;
		if (result === "p2") this.p2.roundsWon++;
		const p1Win = this.p1.roundsWon >= ROUNDS_TO_WIN;
		const p2Win = this.p2.roundsWon >= ROUNDS_TO_WIN;
		if (p1Win || p2Win) {
			this.phase = "matchOver";
			this.winner = p1Win && p2Win ? "draw" : p1Win ? "p1" : "p2";
			if (this.winner === "p1") this.p1.animation = "victory";
			if (this.winner === "p2") this.p2.animation = "victory";
		} else {
			this.phase = "roundEnd";
			this.phaseFrames = 0;
		}
	}
	beginNextRound() {
		this.round++;
		this.phase = "intro";
		this.phaseFrames = 0;
		this.timerFrames = ROUND_TIME_FRAMES;
		this.hitStopFrames = 0;
		this.pinHold = 0;
		this.grapple.release(this.currentFrame);
		const p1Wins = this.p1.roundsWon;
		const p2Wins = this.p2.roundsWon;
		this.p1 = this.makeFighter(this.config.p1, -this.config.stage.spawnX);
		this.p2 = this.makeFighter(this.config.p2, this.config.stage.spawnX);
		this.p1.roundsWon = p1Wins;
		this.p2.roundsWon = p2Wins;
		this.p1.facing = 1;
		this.p2.facing = -1;
	}
	legacyHitbox(move) {
		return {
			offsetX: .9,
			offsetZ: 0,
			width: 1.2,
			depth: .8,
			damage: move.damage,
			hitstun: move.hitstun ?? 15,
			blockstun: move.blockstun ?? 9,
			pushback: move.pushback,
			launch: 0
		};
	}
	resolveBodySeparation() {
		const dx = this.p2.x - this.p1.x;
		const dz = this.p2.z - this.p1.z;
		const distance = Math.hypot(dx, dz);
		const minimum = .72;
		if (distance <= 0 || distance >= minimum) return;
		const nx = dx / distance;
		const nz = dz / distance;
		const correction = (minimum - distance) * .5;
		this.p1.x -= nx * correction;
		this.p1.z -= nz * correction;
		this.p2.x += nx * correction;
		this.p2.z += nz * correction;
		this.clamp(this.p1);
		this.clamp(this.p2);
	}
	updateFacing() {
		if (this.p2.x > this.p1.x + .01) {
			this.p1.facing = 1;
			this.p2.facing = -1;
		} else if (this.p2.x < this.p1.x - .01) {
			this.p1.facing = -1;
			this.p2.facing = 1;
		}
	}
	clamp(f) {
		f.x = Math.max(-this.config.stage.boundsX, Math.min(this.config.stage.boundsX, f.x));
		f.z = Math.max(-this.config.stage.boundsZ, Math.min(this.config.stage.boundsZ, f.z));
	}
};
function StageMesh({ stage }) {
	const posts = (0, import_react.useMemo)(() => [
		[-stage.boundsX, -stage.boundsZ],
		[stage.boundsX, -stage.boundsZ],
		[-stage.boundsX, stage.boundsZ],
		[stage.boundsX, stage.boundsZ]
	], [stage.boundsX, stage.boundsZ]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			receiveShadow: true,
			position: [
				0,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [28, 22] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: stage.floorColor,
				roughness: 1,
				metalness: 0,
				flatShading: true
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				.01,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [stage.boundsX * 2.2, stage.boundsZ * 2.4] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: stage.accentColor,
				roughness: .95,
				flatShading: true
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("gridHelper", {
			args: [
				stage.boundsX * 2.2,
				10,
				"#3a342c",
				"#26221c"
			],
			position: [
				0,
				.02,
				0
			]
		}),
		stage.kind === "ring" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [posts.map(([x, z], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				.7,
				z
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.16,
				1.4,
				.16
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#c8c4b8",
				roughness: .4,
				metalness: .3,
				flatShading: true
			})]
		}, i)), [
			.35,
			.7,
			1.05
		].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					y,
					-stage.boundsZ
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					stage.boundsX * 2,
					.05,
					.05
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#d0ccc4",
					flatShading: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					y,
					stage.boundsZ
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					stage.boundsX * 2,
					.05,
					.05
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#d0ccc4",
					flatShading: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-stage.boundsX,
					y,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.05,
					.05,
					stage.boundsZ * 2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#d0ccc4",
					flatShading: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					stage.boundsX,
					y,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.05,
					.05,
					stage.boundsZ * 2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#d0ccc4",
					flatShading: true
				})]
			})
		] }, y))] }),
		stage.kind === "warehouse" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					2.4,
					-7.4
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					22,
					5,
					.4
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: stage.wallColor,
					flatShading: true
				})]
			}),
			[
				-8,
				-3,
				3,
				8
			].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					x,
					2.2,
					-6.8
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					4.4,
					.5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#3a3228",
					flatShading: true
				})]
			}, x)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-9,
					.4,
					3.2
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					2.4,
					.8,
					1.2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#4a3828",
					flatShading: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					8.5,
					.55,
					2.6
				],
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.6,
					1.1,
					1.6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#2c241c",
					flatShading: true
				})]
			})
		] }),
		stage.kind === "rooftop" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [[
			-10,
			-6,
			-2,
			3,
			7,
			11
		].map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				1.2 + i % 3 * .8,
				-10
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2.4,
				2.4 + i % 3 * 1.6,
				2.4
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#1a1c24",
				flatShading: true
			})]
		}, x)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.08,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				stage.boundsX * 2.4,
				.16,
				stage.boundsZ * 2.6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#303038",
				flatShading: true
			})]
		})] }),
		stage.kind === "gym" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				2.1,
				-6.5
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				16,
				4.2,
				.2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#2a2620",
				roughness: .3,
				metalness: .1,
				flatShading: true
			})]
		}), [-5, 5].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				.45,
				3.4
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.8,
				.9,
				.7
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#3a3228",
				flatShading: true
			})]
		}, x))] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.6,
				8
			],
			rotation: [
				.1,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [30, 8] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: stage.skyColor,
				flatShading: true
			})]
		})
	] });
}
var PSX_PROFILES = {
	PS1_3D: {
		renderScale: .42,
		snap: 160
	},
	RETRO8: {
		renderScale: .22,
		snap: 80
	},
	HIGH_RES: {
		renderScale: 1,
		snap: 0
	}
};
var PSX_VERTEX_SNAP = `
vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
vec4 clipPosition = projectionMatrix * mvPosition;
float snapRes = SNAP_RES;
vec2 ndc = clipPosition.xy / clipPosition.w;
ndc = floor(ndc * snapRes + 0.5) / snapRes;
clipPosition.xy = ndc * clipPosition.w;
gl_Position = clipPosition;
`;
var ALIASES = {
	idle: [
		"idle",
		"Idle",
		"neutral",
		"standing"
	],
	walk: [
		"walk",
		"Walk",
		"walking",
		"run"
	],
	crouch: ["crouch", "Crouch"],
	light: [
		"light",
		"Light",
		"punch",
		"Punch",
		"attack"
	],
	heavy: [
		"heavy",
		"Heavy",
		"strong"
	],
	guard: [
		"guard",
		"Guard",
		"block",
		"Block"
	],
	hit: [
		"hit",
		"Hit",
		"hurt",
		"flinch"
	],
	block: [
		"block",
		"Block",
		"guard"
	],
	grapple: [
		"grapple",
		"Grapple",
		"clinch"
	],
	throw: ["throw", "Throw"],
	pin: ["pin", "Pin"],
	knockdown: [
		"knockdown",
		"down",
		"fall"
	],
	wake: [
		"wake",
		"getup",
		"standup"
	],
	ko: [
		"ko",
		"KO",
		"knockout",
		"death"
	],
	victory: [
		"win",
		"victory",
		"idle"
	]
};
function FighterMesh({ model, animation, position, facing, snap, onReady }) {
	const groupRef = (0, import_react.useRef)(null);
	const mixerRef = (0, import_react.useRef)(null);
	const actionsRef = (0, import_react.useRef)({});
	const activeRef = (0, import_react.useRef)(null);
	const [root, setRoot] = (0, import_react.useState)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const url = glbPublicUrl(model);
	const snapSnippet = (0, import_react.useMemo)(() => PSX_VERTEX_SNAP.replace("SNAP_RES", snap > 0 ? snap.toFixed(1) : "0.0"), [snap]);
	const readyRef = (0, import_react.useRef)(onReady);
	readyRef.current = onReady;
	(0, import_react.useEffect)(() => {
		let live = true;
		setRoot(null);
		setFailed(false);
		new GLTFLoader().load(url, (gltf) => {
			if (!live) return;
			const cloned = gltf.scene.clone(true);
			const box = new Box3().setFromObject(cloned);
			const size = box.getSize(new Vector3());
			const center = box.getCenter(new Vector3());
			const scale = size.y > 0 ? 2.55 / size.y : 1;
			cloned.scale.setScalar(scale);
			cloned.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
			cloned.traverse((child) => {
				const mesh = child;
				if (!mesh.isMesh) return;
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				(Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((material) => {
					const mat = material;
					mat.flatShading = true;
					mat.metalness = Math.min(mat.metalness ?? 0, .15);
					mat.roughness = Math.max(mat.roughness ?? .8, .72);
					if (mat.map) {
						mat.map.minFilter = NearestFilter;
						mat.map.magFilter = NearestFilter;
						mat.map.generateMipmaps = false;
					}
					if (snap > 0) mat.onBeforeCompile = (shader) => {
						shader.vertexShader = shader.vertexShader.replace("#include <project_vertex>", snapSnippet);
					};
					mat.needsUpdate = true;
				});
			});
			mixerRef.current = new AnimationMixer(cloned);
			actionsRef.current = {};
			for (const clip of gltf.animations) actionsRef.current[clip.name] = mixerRef.current.clipAction(clip);
			setRoot(cloned);
			readyRef.current?.(true);
		}, void 0, () => {
			if (!live) return;
			setFailed(true);
			readyRef.current?.(false);
		});
		return () => {
			live = false;
			mixerRef.current?.stopAllAction();
			mixerRef.current = null;
			actionsRef.current = {};
		};
	}, [
		url,
		snap,
		snapSnippet
	]);
	(0, import_react.useEffect)(() => {
		if (!root) return;
		const aliases = ALIASES[animation] ?? [animation];
		const names = Object.keys(actionsRef.current);
		const match = names.find((n) => aliases.some((a) => n.toLowerCase() === a.toLowerCase())) ?? names.find((n) => aliases.some((a) => n.toLowerCase().includes(a.toLowerCase())));
		const next = match ? actionsRef.current[match] : null;
		if (next === activeRef.current) return;
		activeRef.current?.fadeOut(.08);
		if (next) {
			const loop = animation === "idle" || animation === "walk" || animation === "guard" || animation === "crouch";
			next.reset().fadeIn(.08).play();
			next.setLoop(loop ? LoopRepeat : LoopOnce, loop ? Infinity : 1);
		}
		activeRef.current = next;
	}, [animation, root]);
	useFrame(({ clock }, delta) => {
		mixerRef.current?.update(delta);
		const g = groupRef.current;
		if (!g) return;
		const t = clock.elapsedTime;
		let y = position[1];
		let rotX = 0;
		let scaleY = 1;
		if (animation === "idle") y += Math.sin(t * 5) * .03;
		if (animation === "walk") y += Math.abs(Math.sin(t * 9)) * .06;
		if (animation === "light") rotX = -.18;
		if (animation === "heavy") rotX = -.32;
		if (animation === "hit") rotX = .22;
		if (animation === "block" || animation === "guard") rotX = .08;
		if (animation === "crouch") {
			y -= .28;
			scaleY = .82;
		}
		if (animation === "knockdown" || animation === "ko") {
			rotX = 1.15;
			y += .15;
		}
		if (animation === "wake") rotX = .4;
		if (animation === "grapple") rotX = -.12;
		if (animation === "throw") rotX = -.4;
		if (animation === "pin") {
			y -= .35;
			rotX = .55;
		}
		g.position.set(position[0], y, position[2]);
		g.rotation.set(rotX, facing === 1 ? Math.PI / 2 : -Math.PI / 2, 0);
		g.scale.set(1, scaleY, 1);
	});
	if (failed) return null;
	if (!root) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref: groupRef,
		position,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", { object: root })
	});
}
var _desired = new Vector3();
var _look = new Vector3();
function CameraRig({ p1x, p1z, p2x, p2z, shake }) {
	useFrame(({ camera }) => {
		const midX = (p1x + p2x) * .5;
		const midZ = (p1z + p2z) * .5;
		const sep = Math.hypot(p2x - p1x, p2z - p1z);
		const dist = MathUtils.clamp(sep + 4.4, 6.4, 11.2);
		_desired.set(midX + shake * .08, 2.55, midZ + dist);
		_look.set(midX, 1.15, midZ);
		camera.position.lerp(_desired, .085);
		camera.lookAt(_look);
	});
	return null;
}
function MatchScene({ snapshot, p1, p2, stage, graphics, shake, onP1Ready, onP2Ready }) {
	const profile = PSX_PROFILES[graphics];
	const dpr = graphics === "HIGH_RES" ? [1, 1.5] : profile.renderScale;
	const p1Ready = (0, import_react.useRef)(onP1Ready);
	const p2Ready = (0, import_react.useRef)(onP2Ready);
	p1Ready.current = onP1Ready;
	p2Ready.current = onP2Ready;
	const lights = (0, import_react.useMemo)(() => ({
		ambient: stage.ambient,
		key: stage.keyLight,
		fill: stage.fillLight
	}), [stage]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 overflow-hidden bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
			dpr,
			shadows: true,
			gl: {
				antialias: false,
				powerPreference: "high-performance"
			},
			camera: {
				position: [
					0,
					2.6,
					9.2
				],
				fov: 36,
				near: .1,
				far: 80
			},
			style: {
				width: "100%",
				height: "100%",
				imageRendering: "pixelated"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
					attach: "background",
					args: [stage.skyColor]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
					attach: "fog",
					args: [
						stage.fogColor,
						10,
						26
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: lights.ambient }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					position: [
						4,
						8,
						6
					],
					intensity: lights.key,
					castShadow: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					position: [
						-6,
						3,
						-2
					],
					intensity: lights.fill
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {
					p1x: snapshot.p1.x,
					p1z: snapshot.p1.z,
					p2x: snapshot.p2.x,
					p2z: snapshot.p2.z,
					shake
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageMesh, { stage }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FighterMesh, {
					model: p1.model,
					animation: snapshot.p1.animation,
					position: [
						snapshot.p1.x,
						0,
						snapshot.p1.z
					],
					facing: snapshot.p1.facing,
					snap: profile.snap,
					onReady: (ok) => p1Ready.current?.(ok)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FighterMesh, {
					model: p2.model,
					animation: snapshot.p2.animation,
					position: [
						snapshot.p2.x,
						0,
						snapshot.p2.z
					],
					facing: snapshot.p2.facing,
					snap: profile.snap,
					onReady: (ok) => p2Ready.current?.(ok)
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scanlines pointer-events-none absolute inset-0" })]
	});
}
function AttractScene({ p1, p2, stage, graphics }) {
	const dummy = {
		frame: 0,
		phase: "intro",
		round: 1,
		roundsToWin: 2,
		timerFrames: 0,
		timerSeconds: 99,
		hitStopFrames: 0,
		p1: {
			health: p1.hp,
			maxHealth: p1.hp,
			poise: p1.poise,
			maxPoise: p1.poise,
			x: -2.1,
			z: 0,
			facing: 1,
			state: "Neutral",
			stateFrame: 0,
			animation: "idle",
			move: null,
			guarding: false,
			crouching: false,
			roundsWon: 0
		},
		p2: {
			health: p2.hp,
			maxHealth: p2.hp,
			poise: p2.poise,
			maxPoise: p2.poise,
			x: 2.1,
			z: 0,
			facing: -1,
			state: "Neutral",
			stateFrame: 0,
			animation: "idle",
			move: null,
			guarding: false,
			crouching: false,
			roundsWon: 0
		},
		grapplePhase: "none",
		grappleEscapeMeter: 0,
		lastResult: null,
		winner: null
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchScene, {
		snapshot: dummy,
		p1,
		p2,
		stage,
		graphics,
		shake: 0
	});
}
function applyCode(input, code, pressed, player) {
	if (player === 1) switch (code) {
		case "KeyW":
		case "ArrowUp":
			if (code === "KeyW") input.up = pressed;
			break;
		case "KeyS":
			input.down = pressed;
			break;
		case "KeyA":
			input.left = pressed;
			break;
		case "KeyD":
			input.right = pressed;
			break;
		case "KeyJ":
			input.light = pressed;
			break;
		case "KeyK":
			input.heavy = pressed;
			break;
		case "KeyL":
			input.guard = pressed;
			break;
		case "KeyC":
			input.crouch = pressed;
			break;
		case "KeyU":
			input.grapple = pressed;
			break;
		case "KeyI":
			input.escape = pressed;
			break;
		case "KeyO": input.pin = pressed;
	}
	else switch (code) {
		case "ArrowUp":
			input.up = pressed;
			break;
		case "ArrowDown":
			input.down = pressed;
			break;
		case "ArrowLeft":
			input.left = pressed;
			break;
		case "ArrowRight":
			input.right = pressed;
			break;
		case "Numpad1":
		case "Digit1":
			input.light = pressed;
			break;
		case "Numpad2":
		case "Digit2":
			input.heavy = pressed;
			break;
		case "Numpad3":
		case "Digit3":
			input.guard = pressed;
			break;
		case "Numpad0":
			input.crouch = pressed;
			break;
		case "Numpad4":
		case "Digit4":
			input.grapple = pressed;
			break;
		case "Numpad5":
		case "Digit5":
			input.escape = pressed;
			break;
		case "Numpad6":
		case "Digit6": input.pin = pressed;
	}
}
function useInput() {
	const p1Ref = (0, import_react.useRef)({ ...EMPTY_INPUT });
	const p2Ref = (0, import_react.useRef)({ ...EMPTY_INPUT });
	const held = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const inject = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const rebuild = () => {
			const next1 = { ...EMPTY_INPUT };
			const next2 = { ...EMPTY_INPUT };
			const codes = inject.current ?? [...held.current];
			for (const code of codes) {
				applyCode(next1, code, true, 1);
				if (!inject.current) applyCode(next2, code, true, 2);
			}
			p1Ref.current = next1;
			p2Ref.current = next2;
		};
		const down = (e) => {
			if (e.repeat) return;
			held.current.add(e.code);
			rebuild();
		};
		const up = (e) => {
			held.current.delete(e.code);
			rebuild();
		};
		const clear = () => {
			held.current.clear();
			rebuild();
		};
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		window.addEventListener("blur", clear);
		document.addEventListener("visibilitychange", () => {
			if (document.hidden) clear();
		});
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
			window.removeEventListener("blur", clear);
		};
	}, []);
	const setMobile = (patch) => {
		p1Ref.current = {
			...p1Ref.current,
			...patch
		};
	};
	const setKeys = (codes) => {
		inject.current = codes.length ? codes : null;
		const next1 = { ...EMPTY_INPUT };
		for (const code of codes) applyCode(next1, code, true, 1);
		p1Ref.current = next1;
	};
	return {
		p1Ref,
		p2Ref,
		setMobile,
		setKeys
	};
}
var ctx = null;
var master = null;
var musicBus = null;
var sfxBus = null;
var musicTimer = null;
var unlocked = false;
function ensure() {
	if (ctx) return ctx;
	ctx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: "interactive" });
	master = ctx.createGain();
	musicBus = ctx.createGain();
	sfxBus = ctx.createGain();
	musicBus.connect(master);
	sfxBus.connect(master);
	master.connect(ctx.destination);
	return ctx;
}
function unlockAudio() {
	const audio = ensure();
	if (audio.state === "suspended") audio.resume();
	unlocked = true;
}
function setMix(masterVol, musicVol, sfxVol) {
	if (!master || !musicBus || !sfxBus || !ctx) return;
	const t = ctx.currentTime;
	master.gain.setTargetAtTime(masterVol * masterVol, t, .04);
	musicBus.gain.setTargetAtTime(musicVol * musicVol * .35, t, .04);
	sfxBus.gain.setTargetAtTime(sfxVol * sfxVol, t, .04);
}
function tone(freq, dur, type, gain, bus, slide) {
	if (!ctx || !unlocked) return;
	const osc = ctx.createOscillator();
	const g = ctx.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, ctx.currentTime);
	if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), ctx.currentTime + dur);
	g.gain.setValueAtTime(gain, ctx.currentTime);
	g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + dur);
	osc.connect(g);
	g.connect(bus);
	osc.start();
	osc.stop(ctx.currentTime + dur + .02);
}
function noise(dur, gain, bus) {
	if (!ctx || !unlocked) return;
	const length = Math.floor(ctx.sampleRate * dur);
	const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
	const src = ctx.createBufferSource();
	const g = ctx.createGain();
	const filter = ctx.createBiquadFilter();
	filter.type = "lowpass";
	filter.frequency.value = 900;
	src.buffer = buffer;
	g.gain.setValueAtTime(gain, ctx.currentTime);
	g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + dur);
	src.connect(filter);
	filter.connect(g);
	g.connect(bus);
	src.start();
}
function playSfx(kind) {
	if (!sfxBus || !unlocked) return;
	const jitter = 1 + (Math.random() * .12 - .06);
	switch (kind) {
		case "hit":
			tone(180 * jitter, .09, "square", .12, sfxBus, 90);
			noise(.08, .18, sfxBus);
			break;
		case "heavy":
			tone(110 * jitter, .16, "sawtooth", .16, sfxBus, 55);
			noise(.14, .28, sfxBus);
			break;
		case "block":
			tone(420 * jitter, .07, "square", .08, sfxBus, 280);
			break;
		case "ko":
			tone(90, .5, "sawtooth", .2, sfxBus, 40);
			noise(.4, .22, sfxBus);
			break;
		case "menu":
			tone(520, .05, "square", .05, sfxBus);
			break;
		case "confirm":
			tone(240, .08, "square", .07, sfxBus, 480);
			break;
		case "start":
			tone(160, .22, "sawtooth", .1, sfxBus, 320);
			break;
		case "grapple":
			tone(140, .12, "triangle", .1, sfxBus, 80);
			break;
		case "whoosh": noise(.07, .1, sfxBus);
	}
}
function startMusic() {
	if (!ctx || !musicBus || !unlocked) return;
	stopMusic();
	const pattern = [
		98,
		98,
		130,
		87,
		98,
		73,
		65,
		98
	];
	let step = 0;
	const tick = () => {
		if (!ctx || !musicBus) return;
		const osc = ctx.createOscillator();
		const g = ctx.createGain();
		osc.type = "square";
		osc.frequency.value = pattern[step % pattern.length];
		g.gain.setValueAtTime(.07, ctx.currentTime);
		g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + .28);
		osc.connect(g);
		g.connect(musicBus);
		osc.start();
		osc.stop(ctx.currentTime + .3);
		step++;
	};
	tick();
	musicTimer = window.setInterval(tick, 320);
}
function stopMusic() {
	if (musicTimer != null) {
		window.clearInterval(musicTimer);
		musicTimer = null;
	}
}
function PadBtn({ label, className, onHold }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: `pad-btn ${className ?? ""}`,
		onPointerDown: (e) => {
			e.preventDefault();
			e.currentTarget.setPointerCapture(e.pointerId);
			onHold(true);
		},
		onPointerUp: () => onHold(false),
		onPointerCancel: () => onHold(false),
		children: label
	});
}
function MobileControls({ setMobile }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-x-0 bottom-0 z-40 p-3 md:hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto grid grid-cols-3 gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadBtn, {
						label: "UP",
						onHold: (v) => setMobile({ up: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadBtn, {
						label: "A",
						onHold: (v) => setMobile({ left: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadBtn, {
						label: "DN",
						onHold: (v) => setMobile({ down: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadBtn, {
						label: "D",
						onHold: (v) => setMobile({ right: v })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto grid grid-cols-3 gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadBtn, {
						label: "LP",
						onHold: (v) => setMobile({ light: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadBtn, {
						label: "HP",
						onHold: (v) => setMobile({ heavy: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadBtn, {
						label: "GD",
						onHold: (v) => setMobile({ guard: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadBtn, {
						label: "GR",
						onHold: (v) => setMobile({ grapple: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadBtn, {
						label: "ESC",
						onHold: (v) => setMobile({ escape: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadBtn, {
						label: "PIN",
						onHold: (v) => setMobile({ pin: v })
					})
				]
			})]
		})
	});
}
function MenuButton({ children, active, onClick, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		disabled,
		onClick,
		className: `menu-btn w-full text-left ${active ? "is-active" : ""}`,
		children
	});
}
function Kicker({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "kicker",
		children
	});
}
function StatBar({ label, value, max }) {
	const pct = Math.max(0, Math.min(100, value / max * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-16 shrink-0 text-[10px] tracking-[0.18em] text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1.5 flex-1 overflow-hidden rounded-sm bg-elevated",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-accent",
					style: { width: `${pct}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-8 text-right font-mono text-[10px] text-fg tabular-nums",
				children: value
			})
		]
	});
}
function BootScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "screen-fill bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Schwarzerblitz runtime" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-title mt-3",
					children: "BRUTAL FIST"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs tracking-[0.28em] text-muted",
					children: "VALIDATING BANNON CONTRACTS"
				})
			]
		})
	});
}
function TitleScreen({ onStart }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: onStart,
		className: "screen-fill bg-transparent text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 text-center px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "3D fighting / wrestling" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-hero mt-2",
					children: "BRUTAL FIST"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm tracking-[0.42em] text-accent animate-pulse",
					children: "PRESS START"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 max-w-sm mx-auto text-xs leading-relaxed text-muted",
					children: "PS1-era 3D. Bannon roster. 60 Hz simulation. No fallback fighters."
				})
			]
		})
	});
}
function MainMenu({ onMode, onOptions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "screen-fill bg-transparent text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-[min(92vw,420px)] px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Brutal Fist" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-title mt-2 mb-8",
					children: "MAIN MENU"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
							onClick: () => onMode("arcade"),
							children: "ARCADE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
							onClick: () => onMode("versus"),
							children: "VERSUS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
							onClick: () => onMode("training"),
							children: "TRAINING"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
							onClick: onOptions,
							children: "OPTIONS"
						})
					]
				})
			]
		})
	});
}
function OptionsScreen({ settings, onPatch, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "screen-fill bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-[min(92vw,460px)] px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Configuration" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-title mt-2 mb-8",
					children: "OPTIONS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 text-[10px] tracking-[0.22em] text-muted",
							children: "GRAPHICS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2",
							children: [
								"PS1_3D",
								"RETRO8",
								"HIGH_RES"
							].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: g === "HIGH_RES",
								onClick: () => onPatch({ graphics: g }),
								className: `menu-btn px-2 py-3 text-center text-[11px] ${settings.graphics === g ? "is-active" : ""}`,
								children: g === "HIGH_RES" ? "HIGH_RES (RESERVED)" : g
							}, g))
						})] }),
						[
							["MASTER", "master"],
							["MUSIC", "music"],
							["SFX", "sfx"]
						].map(([label, key]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex justify-between text-[10px] tracking-[0.22em] text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums text-fg",
									children: Math.round(settings[key] * 100)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 1,
								step: .01,
								value: settings[key],
								onChange: (e) => onPatch({ [key]: Number(e.target.value) }),
								className: "w-full accent-[var(--color-accent)]"
							})]
						}, key)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
							onClick: onBack,
							children: "BACK"
						})
					]
				})
			]
		})
	});
}
function CharacterSelect({ slot, mode, selected, other, onHover, onConfirm, onBack }) {
	if (!BANNON_PLAYABLE_ROSTER.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "screen-fill bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Roster locked" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-title mt-3",
					children: "NO VALID BANNON GLB FIGHTERS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs tracking-[0.22em] text-danger",
					children: "NO GLB = NO CHARACTER"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "screen-fill bg-bg text-fg overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-full max-w-5xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3 mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Kicker, { children: [
						mode.toUpperCase(),
						" · ",
						slot === "p1" ? "PLAYER 1" : mode === "training" ? "DUMMY" : "PLAYER 2"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "display-title mt-2",
						children: "SELECT FIGHTER"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "menu-btn w-auto px-5 py-3",
						onClick: onBack,
						children: "BACK"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6",
					children: BANNON_PLAYABLE_ROSTER.map((f) => {
						const active = selected?.model === f.model;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onHover(f),
							onDoubleClick: onConfirm,
							className: `fighter-card ${active ? "is-active" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-semibold tracking-[0.16em]",
									children: f.name.toUpperCase()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[9px] tracking-[0.14em] text-muted",
									children: f.attire ?? "Default attire"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-[9px] text-accent",
									children: "GLB PASS"
								})
							]
						}, `${f.id}:${f.model}`);
					})
				}),
				selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-4 sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xl tracking-[0.12em]",
								children: selected.name.toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs text-muted",
								children: [
									selected.style,
									" · ",
									selected.model
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "menu-btn w-auto px-5 py-3 is-active",
								onClick: onConfirm,
								children: "CONFIRM"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
							children: selected.bio
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBar, {
									label: "HP",
									value: selected.hp,
									max: 1e4
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBar, {
									label: "SPD",
									value: selected.speed,
									max: 100
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBar, {
									label: "STR",
									value: selected.strength,
									max: 100
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBar, {
									label: "POISE",
									value: selected.poise,
									max: 100
								})
							]
						}),
						other && slot === "p2" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 text-[10px] tracking-[0.18em] text-muted",
							children: ["P1 ", other.name.toUpperCase()]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-[10px] tracking-[0.16em] text-muted",
					children: [
						BANNON_GLB_PLAYABLE_MODELS.length,
						" playable GLB attires · ",
						BANNON_GLB_BLOCKED_MODELS.length,
						" gated until QA/rig pass"
					]
				})
			]
		})
	});
}
function FighterDetails({ fighter, opponent, onContinue, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "screen-fill bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-[min(92vw,560px)] px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Fighter record" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-title mt-2",
					children: fighter.name.toUpperCase()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed text-muted",
					children: fighter.bio
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 panel p-4 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[10px] tracking-[0.2em] text-muted",
							children: [
								fighter.role,
								" · ",
								fighter.style
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBar, {
							label: "HP",
							value: fighter.hp,
							max: 1e4
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBar, {
							label: "SPD",
							value: fighter.speed,
							max: 100
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBar, {
							label: "STR",
							value: fighter.strength,
							max: 100
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatBar, {
							label: "POISE",
							value: fighter.poise,
							max: 100
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 text-[10px] tracking-[0.16em] text-muted",
							children: [
								"MODEL ",
								fighter.model,
								" · GATE PASS · SCALE ",
								fighter.physicsScale
							]
						})
					]
				}),
				opponent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 text-xs tracking-[0.18em] text-muted",
					children: ["VS ", opponent.name.toUpperCase()]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
						onClick: onBack,
						children: "BACK"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
						active: true,
						onClick: onContinue,
						children: "CONTINUE"
					})]
				})
			]
		})
	});
}
function StageSelect({ selected, onSelect, onConfirm, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "screen-fill bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-[min(92vw,640px)] px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Environment" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-title mt-2 mb-6",
					children: "SELECT STAGE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
					children: STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSelect(s.id),
						className: `fighter-card text-left ${selected === s.id ? "is-active" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm tracking-[0.16em]",
								children: s.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[10px] text-muted",
								children: s.subtitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 text-[10px] tracking-[0.14em] text-muted",
								children: [
									"BOUNDS ",
									s.boundsX.toFixed(1),
									"m × ",
									s.boundsZ.toFixed(1),
									"m"
								]
							})
						]
					}, s.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
						onClick: onBack,
						children: "BACK"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
						active: true,
						onClick: onConfirm,
						children: "FIGHT"
					})]
				})
			]
		})
	});
}
function VersusScreen({ p1, p2, stageName, loading, failed }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "screen-fill bg-bg/55 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-full px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: stageName }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex items-center justify-between gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl sm:text-5xl italic tracking-tight",
								children: p1.name.toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-[10px] tracking-[0.2em] text-muted",
								children: p1.attire ?? p1.model
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-4xl sm:text-6xl font-semibold text-danger",
							children: "VS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl sm:text-5xl italic tracking-tight",
								children: p2.name.toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-[10px] tracking-[0.2em] text-muted",
								children: p2.attire ?? p2.model
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 text-center text-xs tracking-[0.32em] text-accent",
					children: failed ? "FIGHTER ASSET FAILED — MATCH LOCKED" : loading ? "LOADING VERIFIED BANNON GLB" : "READY"
				}),
				failed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 text-center text-[10px] tracking-[0.2em] text-danger",
					children: "NO FALLBACK ACTOR WILL BE USED"
				})
			]
		})
	});
}
function ResultScreen({ winner, p1, p2, mode, arcadeComplete, onRematch, onNext, onSelect, onMenu }) {
	const name = winner === "p1" ? p1.name : winner === "p2" ? p2.name : "DRAW";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "screen-fill bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-[min(92vw,420px)] px-4 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: mode === "arcade" ? "Arcade result" : "Match result" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-hero mt-3",
					children: winner === "draw" ? "DRAW" : "K.O."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-lg tracking-[0.2em]",
					children: name.toUpperCase()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-2",
					children: [
						mode === "arcade" && winner === "p1" && !arcadeComplete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
							active: true,
							onClick: onNext,
							children: "NEXT OPPONENT"
						}),
						mode === "arcade" && (winner !== "p1" || arcadeComplete) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
							active: true,
							onClick: onMenu,
							children: "MAIN MENU"
						}),
						mode !== "arcade" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
							active: true,
							onClick: onRematch,
							children: "REMATCH"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
							onClick: onSelect,
							children: "CHARACTER SELECT"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
							onClick: onMenu,
							children: "MAIN MENU"
						})
					]
				})
			]
		})
	});
}
function ArcadeEnd({ onMenu }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "screen-fill bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 text-center px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Arcade" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-hero mt-3",
					children: "TOUR COMPLETE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: "Five verified Bannon opponents down."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 mx-auto w-[min(92vw,320px)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
						active: true,
						onClick: onMenu,
						children: "MAIN MENU"
					})
				})
			]
		})
	});
}
function PauseMenu({ training, dummy, onDummy, onResetPos, onResetHealth, onResume, onExit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-50 flex items-center justify-center bg-bg/80",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel w-[min(92vw,360px)] p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: training ? "Training" : "Paused" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-2xl tracking-[0.12em]",
					children: "PAUSE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
							active: true,
							onClick: onResume,
							children: "RESUME"
						}),
						training && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
								onClick: onResetPos,
								children: "RESET POSITIONS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
								onClick: onResetHealth,
								children: "RESET HEALTH"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-1.5 pt-1",
								children: [
									"stand",
									"guard",
									"attack"
								].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onDummy(d),
									className: `menu-btn py-3 text-center text-[11px] ${dummy === d ? "is-active" : ""}`,
									children: d.toUpperCase()
								}, d))
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuButton, {
							onClick: onExit,
							children: "EXIT TO MENU"
						})
					]
				})
			]
		})
	});
}
var BOOT_MS = 1600;
function BrutalFistApp() {
	const store = useGameStore();
	const { p1Ref, p2Ref, setMobile, setKeys } = useInput();
	const engineRef = (0, import_react.useRef)(null);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [snapshot, setSnapshot] = (0, import_react.useState)(null);
	const [p1Ready, setP1Ready] = (0, import_react.useState)(false);
	const [p2Ready, setP2Ready] = (0, import_react.useState)(false);
	const [loadFail, setLoadFail] = (0, import_react.useState)(false);
	const [shake, setShake] = (0, import_react.useState)(0);
	const lastHit = (0, import_react.useRef)("");
	const lastPhase = (0, import_react.useRef)("");
	const probeYaw = (0, import_react.useRef)(0);
	const probeSpeed = (0, import_react.useRef)(0);
	const p1 = store.p1 ?? BANNON_PLAYABLE_ROSTER[0] ?? null;
	const p2 = store.p2 ?? BANNON_PLAYABLE_ROSTER[1] ?? BANNON_PLAYABLE_ROSTER[0] ?? null;
	const stage = getStage(store.stageId);
	const attractP1 = BANNON_PLAYABLE_ROSTER[0];
	const attractP2 = BANNON_PLAYABLE_ROSTER[1] ?? BANNON_PLAYABLE_ROSTER[0];
	(0, import_react.useEffect)(() => {
		setMounted(true);
		useGameStore.setState({ settings: loadSettings() });
	}, []);
	(0, import_react.useEffect)(() => {
		if (store.screen !== "boot") return;
		const t = window.setTimeout(() => store.setScreen("title"), BOOT_MS);
		return () => window.clearTimeout(t);
	}, [store.screen, store]);
	(0, import_react.useEffect)(() => {
		setMix(store.settings.master, store.settings.music, store.settings.sfx);
	}, [
		store.settings.master,
		store.settings.music,
		store.settings.sfx
	]);
	const startFromTitle = () => {
		unlockAudio();
		playSfx("start");
		startMusic();
		store.setScreen("menu");
	};
	(0, import_react.useEffect)(() => {
		if (store.screen === "versus") {
			setP1Ready(false);
			setP2Ready(false);
			setLoadFail(false);
			engineRef.current = null;
			setSnapshot(null);
		}
		if (store.screen !== "versus" && store.screen !== "combat") {
			engineRef.current = null;
			setSnapshot(null);
		}
	}, [
		store.screen,
		p1?.model,
		p2?.model,
		store.stageId
	]);
	(0, import_react.useEffect)(() => {
		if (store.screen !== "versus" || !p1 || !p2) return;
		if (loadFail) return;
		if (!p1Ready || !p2Ready) return;
		const t = window.setTimeout(() => {
			engineRef.current = new GameEngine({
				p1,
				p2,
				stage,
				cpuP2: true,
				dummyBehavior: store.dummyBehavior,
				training: store.mode === "training"
			});
			store.fightersReady();
		}, 700);
		return () => window.clearTimeout(t);
	}, [
		store.screen,
		p1Ready,
		p2Ready,
		loadFail,
		p1,
		p2,
		stage,
		store
	]);
	(0, import_react.useEffect)(() => {
		if (store.screen !== "combat" || !engineRef.current) return;
		let raf = 0;
		let last = performance.now();
		let acc = 0;
		const step = 1e3 / 60;
		const loop = (time) => {
			const engine = engineRef.current;
			if (!engine) return;
			engine.setPaused(store.paused);
			acc += Math.min(100, time - last);
			last = time;
			while (acc >= step) {
				engine.tick(p1Ref.current, p2Ref.current);
				acc -= step;
			}
			const snap = engine.getSnapshot();
			setSnapshot(snap);
			probeYaw.current = snap.p1.facing === 1 ? Math.PI / 2 : -Math.PI / 2;
			probeSpeed.current = Math.hypot(p1Ref.current.left || p1Ref.current.right || p1Ref.current.up || p1Ref.current.down ? 1 : 0, 0);
			const healthKey = `${snap.p1.health}:${snap.p2.health}:${snap.p1.state}:${snap.p2.state}`;
			if (healthKey !== lastHit.current) {
				const wasHit = lastHit.current;
				lastHit.current = healthKey;
				if (wasHit && (snap.p1.state === "Hitstun" || snap.p2.state === "Hitstun")) {
					playSfx(snap.hitStopFrames >= 4 ? "heavy" : "hit");
					if (store.settings.cameraShake) setShake(1);
				} else if (wasHit && (snap.p1.state === "Blockstun" || snap.p2.state === "Blockstun")) playSfx("block");
			}
			if (snap.phase !== lastPhase.current) {
				lastPhase.current = snap.phase;
				if (snap.phase === "matchOver") {
					playSfx("ko");
					window.setTimeout(() => store.matchFinished(snap.winner ?? "draw"), 1400);
				}
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [
		store.screen,
		store.paused,
		store.settings.cameraShake,
		store,
		p1Ref,
		p2Ref
	]);
	(0, import_react.useEffect)(() => {
		if (shake <= 0) return;
		const id = requestAnimationFrame(() => setShake((s) => s * .78));
		return () => cancelAnimationFrame(id);
	}, [shake]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.code === "KeyP" && store.screen === "combat") store.setPaused(!store.paused);
			if (e.code === "Enter" && store.screen === "title") startFromTitle();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [store]);
	(0, import_react.useEffect)(() => {
		window.__controlsTest = {
			getYaw: () => probeYaw.current,
			getSpeed: () => {
				const s = snapshot;
				if (!s) return probeSpeed.current;
				return Math.abs(s.p1.x) + Math.abs(s.p1.z) > 0 ? 1 : probeSpeed.current;
			},
			setKeys: (codes) => setKeys(codes)
		};
		return () => {
			delete window.__controlsTest;
		};
	}, [snapshot, setKeys]);
	const onP1Ready = (0, import_react.useCallback)((ok) => {
		setP1Ready(ok);
		if (!ok) setLoadFail(true);
	}, []);
	const onP2Ready = (0, import_react.useCallback)((ok) => {
		setP2Ready(ok);
		if (!ok) setLoadFail(true);
	}, []);
	if (!mounted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[100dvh] w-full bg-bg" });
	if (!BANNON_PLAYABLE_ROSTER.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "screen-fill bg-bg text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kicker text-danger",
					children: "Roster locked"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-title mt-3",
					children: "NO VALID BANNON GLB FIGHTERS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs tracking-[0.22em] text-muted",
					children: "NO GLB = NO CHARACTER"
				})
			]
		})
	});
	const showAttract = store.screen === "title" || store.screen === "menu";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-[100dvh] w-full overflow-hidden bg-bg text-fg touch-none",
		children: [
			showAttract && attractP1 && attractP2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttractScene, {
				p1: p1 ?? attractP1,
				p2: p2 ?? attractP2,
				stage,
				graphics: store.settings.graphics
			}),
			store.screen === "combat" && snapshot && p1 && p2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchScene, {
				snapshot,
				p1,
				p2,
				stage,
				graphics: store.settings.graphics,
				shake
			}),
			store.screen === "boot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BootScreen, {}),
			store.screen === "title" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, { onStart: startFromTitle }),
			store.screen === "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MainMenu, {
				onMode: (m) => {
					playSfx("confirm");
					store.beginMode(m);
				},
				onOptions: () => {
					playSfx("menu");
					store.setScreen("options");
				}
			}),
			store.screen === "options" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OptionsScreen, {
				settings: store.settings,
				onPatch: store.patchSettings,
				onBack: () => store.setScreen("menu")
			}),
			store.screen === "select" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CharacterSelect, {
				slot: store.selecting,
				mode: store.mode,
				selected: store.selecting === "p1" ? store.p1 : store.p2,
				other: store.selecting === "p1" ? store.p2 : store.p1,
				onHover: (f) => {
					playSfx("menu");
					store.setFighter(store.selecting, f);
				},
				onConfirm: () => {
					playSfx("confirm");
					store.confirmSelect();
				},
				onBack: store.backToMenu
			}),
			store.screen === "details" && p1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FighterDetails, {
				fighter: store.selecting === "p2" && store.p2 ? store.p2 : p1,
				opponent: store.mode === "arcade" ? p2 : store.selecting === "p2" ? p1 : p2,
				onContinue: () => {
					playSfx("confirm");
					store.confirmDetails();
				},
				onBack: () => store.setScreen("select")
			}),
			store.screen === "stage" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageSelect, {
				selected: store.stageId,
				onSelect: store.setStage,
				onConfirm: () => {
					playSfx("confirm");
					store.confirmStage();
				},
				onBack: () => store.setScreen("details")
			}),
			store.screen === "versus" && p1 && p2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchScene, {
					snapshot: {
						frame: 0,
						phase: "intro",
						round: 1,
						roundsToWin: 2,
						timerFrames: 0,
						timerSeconds: 99,
						hitStopFrames: 0,
						p1: {
							health: p1.hp,
							maxHealth: p1.hp,
							poise: p1.poise,
							maxPoise: p1.poise,
							x: -2,
							z: 0,
							facing: 1,
							state: "Neutral",
							stateFrame: 0,
							animation: "idle",
							move: null,
							guarding: false,
							crouching: false,
							roundsWon: 0
						},
						p2: {
							health: p2.hp,
							maxHealth: p2.hp,
							poise: p2.poise,
							maxPoise: p2.poise,
							x: 2,
							z: 0,
							facing: -1,
							state: "Neutral",
							stateFrame: 0,
							animation: "idle",
							move: null,
							guarding: false,
							crouching: false,
							roundsWon: 0
						},
						grapplePhase: "none",
						grappleEscapeMeter: 0,
						lastResult: null,
						winner: null
					},
					p1,
					p2,
					stage,
					graphics: store.settings.graphics,
					shake: 0,
					onP1Ready,
					onP2Ready
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VersusScreen, {
				p1,
				p2,
				stageName: stage.name,
				loading: !p1Ready || !p2Ready,
				failed: loadFail
			})] }),
			store.screen === "combat" && snapshot && p1 && p2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchHud, {
					snapshot,
					p1Name: p1.name,
					p2Name: p2.name
				}),
				!store.paused && snapshot.phase !== "matchOver" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileControls, { setMobile }),
				store.paused && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PauseMenu, {
					training: store.mode === "training",
					dummy: store.dummyBehavior,
					onDummy: (d) => {
						store.setDummy(d);
						engineRef.current?.setDummyBehavior(d);
					},
					onResetPos: () => engineRef.current?.resetPositions(),
					onResetHealth: () => engineRef.current?.resetHealth(),
					onResume: () => store.setPaused(false),
					onExit: () => {
						stopMusic();
						store.backToMenu();
					}
				})
			] }),
			store.screen === "result" && p1 && p2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultScreen, {
				winner: store.lastWinner,
				p1,
				p2,
				mode: store.mode,
				arcadeComplete: store.arcadeWins >= 5,
				onRematch: () => {
					playSfx("confirm");
					store.rematch();
				},
				onNext: () => {
					playSfx("confirm");
					store.nextArcade();
				},
				onSelect: store.backToSelect,
				onMenu: () => {
					stopMusic();
					store.backToMenu();
				}
			}),
			store.screen === "arcade-end" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArcadeEnd, { onMenu: store.backToMenu })
		]
	});
}
function MatchHud({ snapshot, p1Name, p2Name }) {
	const p1pct = snapshot.p1.health / snapshot.p1.maxHealth * 100;
	const p2pct = snapshot.p2.health / snapshot.p2.maxHealth * 100;
	const ko = snapshot.phase === "matchOver" || snapshot.p1.health <= 0 || snapshot.p2.health <= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 px-3 pt-3 sm:px-5 sm:pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "health-track",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "health-fill",
								style: { width: `${p1pct}%` }
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex justify-between text-[10px] tracking-[0.16em] text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p1Name.toUpperCase() }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: snapshot.p1.roundsWon
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-14 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-lg tabular-nums text-fg",
							children: snapshot.timerSeconds
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[9px] tracking-[0.2em] text-muted",
							children: ["R", snapshot.round]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "health-track",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "health-fill ml-auto",
								style: { width: `${p2pct}%` }
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex justify-between text-[10px] tracking-[0.16em] text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: snapshot.p2.roundsWon
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p2Name.toUpperCase() })]
						})]
					})
				]
			}),
			snapshot.phase === "intro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-4xl sm:text-6xl tracking-[0.18em] text-fg",
					children: ["ROUND ", snapshot.round]
				})
			}),
			snapshot.grapplePhase !== "none" && snapshot.grapplePhase !== "escaped" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-28 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.22em] text-accent",
				children: [
					snapshot.grapplePhase.toUpperCase(),
					" · ESC ",
					Math.round(snapshot.grappleEscapeMeter)
				]
			}),
			ko && snapshot.phase === "matchOver" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "display-hero text-danger",
					children: "K.O."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-3 left-3 hidden text-[9px] tracking-[0.14em] text-muted md:block",
				children: "WASD MOVE · J LIGHT · K HEAVY · L GUARD · U GRAPPLE · I ESCAPE · O PIN · P PAUSE"
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrutalFistApp, {});
}
//#endregion
export { Home as component };
