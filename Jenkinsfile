pipeline {
  agent any
  options { timestamps() }

  parameters {
    choice(name: 'BRANCH', choices: ['DEV', 'QA', 'PROD'], description: 'Rama a construir')
  }

  environment {
    TARGET_BRANCH = "${params.BRANCH ?: 'DEV'}"
  }

  stages {
    stage('Checkout') {
      steps {
        echo "Haciendo checkout de la rama: ${env.TARGET_BRANCH}"
        deleteDir()
        git branch: "${env.TARGET_BRANCH}",
            url: 'https://github.com/vflorian91/ci-api.git'
      }
    }

    stage('Setup Node') {
      steps {
        bat 'node -v'
        bat 'npm -v'
      }
    }

    stage('Install') {
      steps {
        bat 'npm ci'
      }
    }

    stage('Smoke (placeholder)') {
      steps {
        bat 'npm run test:smoke || exit 0'
      }
    }

    stage('SonarQube Analysis') {
      when { expression { return env.TARGET_BRANCH in ['DEV','QA','PROD'] } }
      steps {
        withSonarQubeEnv('sonarqube') {
          bat 'sonar-scanner'
        }
      }
    }

    stage('Artefacto (solo QA/PROD)') {
      when { anyOf { environment name: 'TARGET_BRANCH', value: 'QA'
                     environment name: 'TARGET_BRANCH', value: 'PROD' } }
      steps {
        bat 'npm run build'
      }
    }
  }

  post {
    always {
      echo "Branch usada: ${env.TARGET_BRANCH}"
    }
    failure {
      echo '❌ Pipeline FAILED'
    }
    success {
      echo '✅ Pipeline OK'
    }
  }
}
