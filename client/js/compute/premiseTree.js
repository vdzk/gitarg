import { $ } from '../state.js'

export const getPremisesTree = () => {
  if ($.screen !== 'statements' || !$.treeView || $.mainStatement === null) {
    return false
  }

  let boundary = [ $.mainStatement ]
  while (boundary.length > 0) {
    const sid = boundary.pop()

  }

  //TODO: Continue here!!!
  //TODO: Continue here!!!
  //TODO: Continue here!!!
  //Keep list of expanded *paths*
  //Starting from boundary [$.mainStatement] display and add premises to boundary if matched expanded paths
  //Expanding a paths should collapse an alternate path to the same node
  //Manage expanded paths in state $ via actions and build an ectual list and clean up epanded paths in compute
}
