export default function interpolate (base = {}, extensions = {}) {
	return { ...base, ...extensions }
}