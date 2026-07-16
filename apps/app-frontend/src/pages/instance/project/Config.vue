<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get_config, get_config_info, save_config } from '@/helpers/config'
import { LoadingIndicator, Toggle, Slider } from '@icmods/ui'
import { ChevronLeftIcon } from '@icmods/assets'
import { handleError } from '@/store/state'

const props = defineProps({
  instance: {
    type: Object,
    required: true,
  },
  project: {
    type: Object,
    required: true
  }
})

const loading = ref(true)
const config = ref<any>({})
const configInfo = ref<any>({})
const expandedGroups = reactive<Record<string, boolean>>({})

const init = async () => {
  loading.value = true
  try {
    config.value = await get_config(props.instance.path, props.project.path) || {}
    configInfo.value = await get_config_info(props.instance.path, props.project.path) || {}
  } catch (err) {
    handleError(err)
  }
  loading.value = false
}

onMounted(() => {
  init()
})

const infoProperties = computed(() => configInfo.value.properties || {})

function getInfoParam(paramPath: string, paramName: string) {
  const property = infoProperties.value[paramPath]
  if (!property) return null
  return property[paramName]
}

function getLocalizedInfoParam(paramPath: string, paramName: string) {
  const property = infoProperties.value[paramPath]
  if (!property) return null
  const value = property[paramName]
  if (!value) return null
  if (typeof value === 'string') return value
  
  const lang = navigator.language.split('-')[0] || 'en'
  return value[lang] || value['en'] || null
}

function getReadableName(option: string) {
  const path = option.split('.')
  let name = path[path.length - 1]
  name = name.replace(/_/g, ' ')
  if (name.length > 1) {
    name = name.charAt(0).toUpperCase() + name.slice(1)
  }
  return name
}

function getNestedValue(obj: any, path: string) {
  const parts = path.split('.')
  if (parts.length === 1) return obj[parts[0]]
  return obj[parts[0]] ? obj[parts[0]][parts[1]] : undefined
}

const parsedSettings = computed(() => {
  const result: any[] = []
  
  for (const [key, value] of Object.entries(config.value)) {
    if (key.toLowerCase() === 'enabled') continue

    // Check if shouldDisplay
    const displayStr = getInfoParam(key, 'display')
    if (displayStr === 'false' || displayStr === false) continue
    
    // Check displayIf condition
    const condition = getInfoParam(key, 'displayIf')
    if (condition) {
       const isNegated = condition.startsWith('!')
       const target = isNegated ? condition.slice(1) : condition
       const val = getNestedValue(config.value, target)
       if (Boolean(val) === isNegated) continue
    }
    
    const index = getInfoParam(key, 'index') ?? 9999
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Group
      const children: any[] = []
      for (const [childKey, childValue] of Object.entries(value)) {
        if (childKey.toLowerCase() === 'enabled') continue
        
        const fullKey = `${key}.${childKey}`
        
        children.push({
          key: childKey,
          fullKey,
          value: childValue,
          name: getLocalizedInfoParam(fullKey, 'name') || getReadableName(fullKey),
          description: getLocalizedInfoParam(fullKey, 'description'),
          type: getInfoParam(fullKey, 'type'),
          min: parseInt(getInfoParam(fullKey, 'min') || '0'),
          max: parseInt(getInfoParam(fullKey, 'max') || '100'),
          index: getInfoParam(fullKey, 'index') ?? 9999
        })
      }
      children.sort((a, b) => a.index - b.index)
      
      const collapsibleStr = getInfoParam(key, 'collapsible')
      const collapsible = collapsibleStr === null || collapsibleStr === undefined ? true : String(collapsibleStr) === 'true'
      const isExpanded = expandedGroups[key] ?? !collapsible

      result.push({
        isGroup: true,
        key,
        name: getLocalizedInfoParam(key, 'name') || getReadableName(key),
        description: getLocalizedInfoParam(key, 'description'),
        children,
        index,
        collapsible,
        expanded: isExpanded
      })
    } else {
      // Direct
      result.push({
        isGroup: false,
        key,
        fullKey: key,
        value,
        name: getLocalizedInfoParam(key, 'name') || getReadableName(key),
        description: getLocalizedInfoParam(key, 'description'),
        type: getInfoParam(key, 'type'),
        min: parseInt(getInfoParam(key, 'min') || '0'),
        max: parseInt(getInfoParam(key, 'max') || '100'),
        index
      })
    }
  }
  
  result.sort((a, b) => a.index - b.index)
  return result
})

function updateValue(fullKey: string, newValue: any) {
  const parts = fullKey.split('.')
  if (parts.length === 1) {
    config.value[parts[0]] = newValue
  } else {
    config.value[parts[0]][parts[1]] = newValue
  }
  
  save_config(props.instance.path, props.project.path, config.value).catch(handleError)
}

function handleInputNumber(e: Event, setting: any) {
  const el = e.target as HTMLInputElement
  const val = parseFloat(el.value)
  if (!isNaN(val)) {
    updateValue(setting.fullKey, val)
  }
}

function toggleGroup(group: any) {
  if (group.collapsible) {
    expandedGroups[group.key] = !group.expanded
  }
}
</script>

<template>
  <div class="flex flex-col gap-3 max-w-[48rem] w-full">

    <section v-if="loading" class="flex justify-center p-8">
      <LoadingIndicator />
    </section>

    <section v-else class="flex flex-col bg-bg-raised rounded-xl overflow-hidden">

      <div class="settings-list flex flex-col">
        <template v-for="setting in parsedSettings" :key="setting.key">
          
          <div v-if="setting.isGroup" class="setting-group">
            <div 
              class="group-header flex items-center justify-between py-3 px-4 cursor-pointer select-none hover:bg-hover transition-colors"
              @click="toggleGroup(setting)"
            >
              <div class="flex flex-col">
                <span class="font-semibold text-lg text-contrast">{{ setting.name }}</span>
                <span v-if="setting.description" class="text-sm text-secondary">{{ setting.description }}</span>
              </div>
              <ChevronLeftIcon 
                v-if="setting.collapsible"
                class="h-6 w-6 transition-transform" 
                :class="setting.expanded ? 'rotate-90' : '-rotate-90'"
              />
            </div>
            
            <div v-show="setting.expanded" class="group-children flex flex-col pl-4">
              <template v-for="child in setting.children" :key="child.key">
                <div class="setting-item flex flex-col justify-between gap-4 py-2 px-4"
                     :class="child.type === 'SeekBar' ? 'items-stretch' : 'sm:flex-row sm:items-center'">
                  <div class="flex flex-col flex-1">
                    <span class="font-medium text-contrast">{{ child.name }}</span>
                    <span v-if="child.description" class="text-sm text-secondary whitespace-pre-wrap mt-1">{{ child.description }}</span>
                  </div>
                  
                  <div class="setting-editor flex justify-end"
                       :class="child.type === 'SeekBar' ? 'w-full' : 'w-full sm:w-1/3'">
                    <Toggle 
                      v-if="typeof child.value === 'boolean'" 
                      :id="`toggle-${child.fullKey}`"
                      :model-value="child.value"
                      :checked="child.value"
                      @update:model-value="val => updateValue(child.fullKey, val)"
                    />
                    
                    <Slider 
                      v-else-if="child.type === 'SeekBar'"
                      :min="child.min" 
                      :max="child.max" 
                      :step="1"
                      :model-value="child.value"
                      class="w-full"
                      @update:model-value="(val) => updateValue(child.fullKey, val)"
                    />

                    <input
                      v-else-if="typeof child.value === 'number'"
                      type="number"
                      class="text-input w-full"
                      :value="child.value"
                      @blur="e => handleInputNumber(e, child)"
                    />
                    
                    <input
                      v-else
                      type="text"
                      class="text-input w-full"
                      :value="child.value"
                      @blur="e => updateValue(child.fullKey, (e.target as HTMLInputElement).value)"
                    />
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div v-else class="setting-item flex flex-col justify-between gap-4 py-2 px-4"
               :class="setting.type === 'SeekBar' ? 'items-stretch' : 'sm:flex-row sm:items-center'">
            <div class="flex flex-col flex-1">
              <span class="font-medium text-contrast">{{ setting.name }}</span>
              <span v-if="setting.description" class="text-sm text-secondary whitespace-pre-wrap mt-1">{{ setting.description }}</span>
            </div>
            
            <div class="setting-editor flex justify-end"
                 :class="setting.type === 'SeekBar' ? 'w-full' : 'w-full sm:w-1/3'">
              <Toggle 
                v-if="typeof setting.value === 'boolean'" 
                :id="`toggle-${setting.fullKey}`"
                :model-value="setting.value"
                :checked="setting.value"
                @update:model-value="val => updateValue(setting.fullKey, val)"
              />
              
              <Slider 
                v-else-if="setting.type === 'SeekBar'"
                :min="setting.min" 
                :max="setting.max"
                :step="1" 
                :model-value="setting.value"
                class="w-full"
                @update:model-value="(val) => updateValue(setting.fullKey, val)"
              />

              <input
                v-else-if="typeof setting.value === 'number'"
                type="number"
                class="text-input w-full"
                :value="setting.value"
                @blur="e => handleInputNumber(e, setting)"
              />
              
              <input
                v-else
                type="text"
                class="text-input w-full"
                :value="setting.value"
                @blur="e => updateValue(setting.fullKey, (e.target as HTMLInputElement).value)"
              />
            </div>
          </div>

        </template>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.text-input {
  background: var(--color-bg);
  border: 1px solid var(--color-divider);
  color: var(--color-contrast);
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  &:focus {
    outline: none;
    border-color: var(--color-brand);
  }
}
</style>
