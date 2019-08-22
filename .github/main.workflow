workflow "Deploy" {
  on = "push"
  resolves = "Deploy Production Site"
}

action "Deploy Production Site" {
  uses = "w9jds/firebase-action@master"
  args = "deploy --only hosting:prod"
  env = {
    PROJECT_ID = "new-eden-storage-a5c23"
  }
  secrets = ["FIREBASE_TOKEN"]
}
