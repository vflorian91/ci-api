pipeline {
  agent any
  options { timestamps() }

  parameters {
    choice(name: 'BRANCH', choices: ['DEV', 'QA', 'PROD'], description: 'Rama a construir')
  }

  environment {
    TARGET_BRANCH = "${params.BRANCH ?: 'DEV'}"
    SONAR_SERVER  = 'Sonar' // Nombre que coincide con tu configuración Jenkins
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
      steps {
        echo "Ejecutando análisis en SonarQube (${env.SONAR_SERVER})"
        withSonarQubeEnv(env.SONAR_SERVER) {
          bat 'sonar-scanner -v'
          bat 'sonar-scanner'
        }
      }
    }

    stage('Artefacto (solo QA/PROD)') {
      when {
        anyOf {
          environment name: 'TARGET_BRANCH', value: 'QA'
          environment name: 'TARGET_BRANCH', value: 'PROD'
        }
      }
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
