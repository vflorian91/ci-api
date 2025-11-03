pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    // Nombre del servidor Sonar configurado en Jenkins > System
    SONARQUBE_SERVER = 'SonarQube'
    // Herramienta NodeJS configurada en Jenkins > Tools
    NODEJS_TOOL = 'node18'
    // Herramienta SonarScanner configurada en Jenkins > Tools
    SONAR_SCANNER = 'sonar-scanner'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: '*/' + env.BRANCH_NAME]],
          userRemoteConfigs: [[url: 'https://github.com/vflorian91/ci-api.git']]
        ])
      }
    }

    stage('Setup Node') {
      steps {
        script {
          def nodeHome = tool name: env.NODEJS_TOOL, type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
          env.PATH = "${nodeHome}\\bin;${env.PATH}"
        }
      }
    }

    stage('Install') {
      steps {
        bat 'npm ci || npm install'
      }
    }

    stage('Smoke (placeholder)') {
      steps {
        bat 'node -e "console.log(\\"smoke ok\\")"'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv("${SONARQUBE_SERVER}") {
          script {
            def scannerHome = tool name: env.SONAR_SCANNER, type: 'hudson.plugins.sonar.SonarRunnerInstallation'
            bat "\"${scannerHome}\\bin\\sonar-scanner.bat\" -Dproject.settings=sonar-project.properties"
          }
        }
      }
    }

    stage('Artefacto (solo QA/PROD)') {
      when { anyOf { branch 'QA'; branch 'PROD' } }
      steps {
        bat 'powershell -Command "Compress-Archive -Path src,package.json,package-lock.json -DestinationPath ci-api-%BRANCH_NAME%.zip -Force"'
        archiveArtifacts artifacts: "ci-api-%BRANCH_NAME%.zip", fingerprint: true
      }
    }
  }

  post {
    always { echo "Branch: ${env.BRANCH_NAME}" }
    success { echo '✅ Pipeline OK' }
    failure { echo '❌ Pipeline FAILED' }
  }
}
