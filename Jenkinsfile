pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "anime_notify"
    }

    tools {
        go 'Go-Installer'
        nodejs 'Node-Installer'
    }

    stages {
        stage('Code Analysis & Testing') {

            parallel {

                stage('Go Backend Test') {
                    steps {
                        echo "Testing Go API..."
                        sh 'go test -v ./...'
                    }
                }

                stage('Next Frontend Test') {
                    steps {
                        echo "Testing Next App..."
                        dir('anime-frontend') {
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo "Requesting secure secrets from the Vault..."
                
                withCredentials([file(credentialsId: 'anime-env-file', variable: 'SECRET_ENV')]) {

                    sh 'cp $SECRET_ENV .env'

                    echo "Building Docker Images..."
                    sh 'docker compose build --no-cache'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo "Deploying..."
                sh 'docker compose down'
                sh 'docker compose up -d'
            }
        }
    }


    post {
        success {
            echo "Pipeline Succeeded! The new architecture is live..."
        }
        failure {
            echo "Pipeline Failed! The deployment was halted to protect the environment."
            mail to: 'yevinshen@gmail.com',
                 subject: "Build Failed: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                 body: "Check the logs. Something broke in the deployment."
        }
        always {
            echo "Cleaning up workspace to save disk space..."
            cleanWs()
        }
    }
}