/**
 * prompt.editor example
 *
 *   pnpm editor
 */

import { prompt, success, info } from '@caret/registry'

const message = await prompt.editor({
  label: 'Commit message',
  description: 'Describe your changes (ctrl+d to submit)',
  placeholder: 'Type here…',
  validate: (v) => (v.trim().length === 0 ? 'Message cannot be empty' : null),
})

success('Commit message saved')
info(`Content:\n${message}`)
