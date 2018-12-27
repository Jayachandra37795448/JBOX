#!/usr/bin/env groovy
import groovy.json.JsonSlurperClassic
import groovy.json.JsonOutput

runjenkinsfile()

def runjenkinsfile(){

	node('mesos'){

  		// Mark the code checkout 'stage'....
  		stage ('Checkout') {
    		cleanWs notFailBuild: true

 	        //checkout the project
        	checkout scm
  		}

        def yamlPath = "${pwd()}/project.yaml"

        // read project.yaml to setup def variable and tools
        sh("cat ${yamlPath}")
  		def props = readYaml file: 'project.yaml'

        //sh 'ls /root/tools/jenkins.plugins.nodejs.tools.NodeJSInstallation/'

        def nodeHome = tool 'nodejs-8.11.2'

        env.MAVEN_OPTS = '-Djavax.net.ssl.trustStore=/etc/ssl/certs/java/cacerts'
  		env.JAVA_HOME="${tool '1.8'}"
        if ("${props.buildType}".startsWith('ang6')){
            env.PATH = "${nodeHome}/bin:${env.PATH}"
        } else {
            env.PATH="${env.JAVA_HOME}/bin:${env.PATH}"
        }

  		def server = Artifactory.server 'edp-artifactory'
        def server2 = Artifactory.newServer url: 'https://artifactory.corporate.t-mobile.com/artifactory', credentialsId: 'a0c3f9d2-71d1-413f-ad17-4faa32367b81'
  		def sqJobName = env.JOB_NAME.replace('/', '-')
  		def mvnHome = tool 'apache-maven-3.3.9'
  		def curlHome = tool 'curl'
  		def jdk = tool '1.8'
  		def python = tool 'python2.7'
  		def submittedTime = new Date()
        def cfHome = tool 'cf';

        def devBaseURL = 'https://etp-reports.apps.px-npe01.cf.t-mobile.com';
        def prodBaseURL = 'https://etp-reports.apps.px-prd01.cf.t-mobile.com';

  		try {

    		//send out build start notification
    		notifyBuild('STARTED', props.opsLead)

        	echo "BRANCH: " + "${env.BRANCH_NAME}"
        	// printout project.yaml
        	echo "${yamlPath} used for this execution"
       		echo "${props}"
        	echo "${server}"
        	echo "submittedTime ${submittedTime}"

            println("branch: "+ "${env.BRANCH_NAME}")
			//=========================================================================================
			// when create a Feature branch
			//=========================================================================================
			// Actions:
			//     Local Test
			//     Authenticating
			//     E2E Test
			//     E2E QG
			//=========================================================================================
    		if ("${env.BRANCH_NAME}".startsWith('feature')) {
      			if ("${props.buildType}".startsWith('ang6')){
                    buildByNg()
	  			    sonarScan(props.projectName, env.BRANCH_NAME.replaceAll('\\/','\\-'), sqJobName)
                } else {
                	runLocalTest(props)
	  			    sonarScan(props.projectName, env.BRANCH_NAME.replaceAll('\\/','\\-'), sqJobName)
      			    /*this is testing only
      			    buildByMaven(props, 'develop')
      			    deployToArtifactory(props, 'develop', server2, 'cloud')
      			    deployToArtifactory(props, 'develop', server, 'edp')*/
                }
    		}

			//=========================================================================================
			// after merge to dev, it deploys to snapshot
			//=========================================================================================
			// Actions in order:
			//     Build
			//     SonarQube Analysis
			//     Sonar QG
			//     Deploy to Cloud Foundry Dev
			//     Deploy to Artifactory
			//     Authenticating
			//     E2E Test
			//     E2E QG
			//=========================================================================================
    		if ("${env.BRANCH_NAME}"=="develop") {

                if ("${props.buildType}".startsWith('ang6')){
                    buildByNgProd('development')
	  			    sonarScan(props.projectName, env.BRANCH_NAME, sqJobName)
                } else {
      			    buildByMaven(props, env.BRANCH_NAME)
	  			    sonarScan(props.projectName, env.BRANCH_NAME, sqJobName)
      			    deployToArtifactory(props, env.BRANCH_NAME, server, 'edp')
      			    deployToArtifactory(props, env.BRANCH_NAME, server2, 'cloud')
                }
	  			if (!"${props.buildType}".startsWith('jar')){
	  				deployToPCF(props, env.BRANCH_NAME)
	  			}

	  			 getE2ETest(devBaseURL);
    		}

			//=========================================================================================
			// before merge to master, it deploys to release
			//=========================================================================================
			// Actions in order:
			//     Build
			//     SonarQube Analysis
			//     Sonar QG
			//     Deploy to Cloud Foundry Prod
			//     Deploy to Artifactory
			//     Authenticating
			//     E2E Test
			//     E2E QG
			//=========================================================================================
    		else if ("${env.BRANCH_NAME}".startsWith('release')){

                if ("${props.buildType}".startsWith('ang6')){
                    buildByNgProd('production')
	  			    sonarScan(props.projectName, 'release', sqJobName)
                } else {
      			    buildByMaven(props, env.BRANCH_NAME)
	  			    sonarScan(props.projectName, 'release', sqJobName)
      			    deployToArtifactory(props, env.BRANCH_NAME, server2, 'cloud')
      			    deployToArtifactory(props, env.BRANCH_NAME, server, 'edp')
                }
	  			if (!"${props.buildType}".startsWith('jar')){
	  				deployToPCF(props, env.BRANCH_NAME)
	  			}

	  			 getE2ETest(prodBaseURL);
    		}

			//=========================================================================================
			// When create a PR
			//=========================================================================================
			// Actions in order:
			//     Local Test
			//     SonarQube Analysis
			//     Sonar QG
			//=========================================================================================
    		else if ("${env.BRANCH_NAME}".startsWith('PR-')) {

                if ("${props.buildType}".startsWith('ang6')){
                    buildByNg()
 	  			    //sonarScan(props.projectName, 'PR', sqJobName)
                } else {
                	runLocalTest(props)
     	  			//sonarScan(props.projectName, 'PR', sqJobName)
               }

    		} else {

      			currentBuild.result = 'SUCCESS'

    		}

  		} catch (e) {

    		//If there was an exception thrown, the build failed
    		currentBuild.result = "FAILED"
    		throw e

  		} finally {

  		    // if user didn't define e2e, then e2e should be skipped.
      		if (props.containsKey('e2e') && ("${env.BRANCH_NAME}".startsWith('feature') ||
        		"${env.BRANCH_NAME}"=="develop" ||
        		"${env.BRANCH_NAME}".startsWith('release'))){

      			env.authToken = getAuthenticate()

      			def execId = runE2E(env.BRANCH_NAME, env.authToken, props)

      			currentBuild.result = getE2EStatus(execId, env.authToken)
    		}

    		//Success or failure, always send notifications
    		notifyBuild(currentBuild.result, props.opsLead)
  		}
	}
}
return this;


//*******************************FUNCTION DELCARATIONS*******************************************************
def runLocalTest(props){
    //execute mvn test
    stage('Local Test') {
      	sh "mvn test -DappVersion=${props.appVersion}"
    }
}

def buildByMaven(props, branchName){

  	stage('Build') {
       	//mvn commands to build project
       	// *.war case
       	if ("${props.buildType}".startsWith('war')){
       		sh "mvn -Pprod,swagger package -DappVersion=${props.appVersion}"
       	} else {
       	    // *.jar case
       	    if ("${branchName}"=="develop" ||
        		"${branchName}".startsWith('PR-')){
        		sh "mvn clean install -DappVersion=${props.appVersion} -Dartifactory.publish.artifacts=true -Dartifactory.publish.buildInfo=true"
    		} else if ("${branchName}".startsWith('release')){
        		sh "mvn clean package -DappVersion=${props.appVersion}"
    		}
       	}
   	}
}


def buildByNg(){

  stage('Build') {
    sh "echo ${env.PATH}"
    sh '''wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
    echo \'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main\' | tee /etc/apt/sources.list.d/google-chrome.list
    apt-get -y update
    apt-get -y install google-chrome-stable'''
    sh 'npm install @angular/cli'
    env.PATH = "./node_modules/@angular/cli/bin:${env.PATH}"
    sh 'apt-get install bzip2 && npm install && cd server && npm install && cd .. && npm run ng build && npm test && cp ./includes/nginx.conf ./dist/tep-test-report/'
    }
}

def buildByNgProd(space){

  stage('Build') {
    sh "echo ${env.PATH}"
    sh '''wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
        echo \'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main\' | tee /etc/apt/sources.list.d/google-chrome.list
        apt-get -y update
        apt-get -y install google-chrome-stable'''

    sh 'apt-get install bzip2 && npm install && cd server && npm install && cd ..'

    if(space.startsWith('dev')){
        sh 'npm run ng build --prod --configuration=pcfdev'
    }else{
        sh 'npm run ng build --prod --configuration=production'
    }

    sh 'npm test'
    sh 'cp ./includes/nginx.conf ./dist/tep-test-report/'
  }
}

//-------------------------------------------------------------------------------------
// deploy to PCF (develop/ release)
// 1. ask admin approval for release deployment only
// 2. deploy to pcf
//-------------------------------------------------------------------------------------
def deployToPCF(props, branchName){

    def targetEnv = 'dev'
    def targetSpace = 'dev.px-npe01.cf.t-mobile.com'
    def buildspace = 'development'
    def targetUrl = 'api.sys.px-npe01.cf.t-mobile.com'
    def manifest = 'config/pcf/dev/manifest.yml'

    if ("${branchName}".startsWith('release')){
        targetEnv = 'prod'
        buildspace = 'production'
        targetSpace = 'apps.px-prd01.cf.t-mobile.com'
        targetUrl = 'api.sys.px-prd01.cf.t-mobile.com'
        manifest = 'config/pcf/prod/manifest.yml'

        stage ('Deployment Approval') {
	        timeout(time: 30, unit: 'MINUTES') {
                input message: 'Do you approve deployment?', submitter: 'CT Framework Platform'
    		}
        }
    }

    //-------------------------------------------------------------------------------------
    if ("${props.buildType}".startsWith('ang6')){
        stage ('Deploy to Cloud Foundry ' + buildspace + ' Dashboard') {
            withCredentials([usernamePassword(credentialsId: 'pcf-CT_TEP', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                sh '''cf login -u $USERNAME -p $PASSWORD -a '''+ targetUrl +''' -o CT_TEP -s '''+ buildspace + ''''''
                sh "cf push -f ${manifest}"
            }
        }
    } else {
        stage ('Deploy to Cloud Foundry ' + buildspace) {
            withCredentials([usernamePassword(credentialsId: 'pcf-CT_TEP', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                sh 'ls -al target/'
                sh '''cf login -u $USERNAME -p $PASSWORD -a '''+ targetUrl +''' -o CT_TEP -s '''+ buildspace + ''''''
                sh "cf push -f deploy/cloudfoundry/manifest_${targetEnv}.yml -p target/${props.artifactoryId}-${props.appVersion}.${env.BUILD_NUMBER}.war -d ${targetSpace}"
            }
        }
    }
}

//-------------------------------------------------------------------------------------
// deploy to Artifactory (RELEASE/ SNAPSHOT)
// 1. select *.war to deploy
// 2. set uploade spec
// 3. create build info
// 4. deploy *.war
//-------------------------------------------------------------------------------------
def deployToArtifactory(props, branchName, server, where2deploy){

    stage ('Deploy to ' + where2deploy.toUpperCase() + ' Artifactory') {

  		def buildloc = ("${branchName}".startsWith('release')) ? 'RELEASE' : 'SNAPSHOT'
    	def artifactoryRepo = ("${branchName}".startsWith('release')) ? 'tmo-releases/' : 'tmo-snapshots/'
    	if ("${where2deploy}"=="cloud"){
    	    artifactoryRepo = ("${branchName}".startsWith('release')) ? 'tmo-release-local/' : 'tmo-snapshot-local/';
    	}
    	artifactoryRepo = artifactoryRepo +props.groupId.replaceAll('\\.','\\/')+'/'+props.artifactoryId+'/'+props.appVersion+'-'+buildloc+'/'
    	def uploadSpec = ''

        // API case
    	if ("${props.buildType}".startsWith('war')){

        	//insert code to append -SNAPSHOT/RELEASE to artifact
            if ("${where2deploy}"=="edp"){
        	    sh '''cd target/ && for file in *.war ; do mv $file `echo $file | sed \"s/\\(.*\\).war/\\1.'''+env.BUILD_NUMBER+'''\\.war/\"` ; done'''
            }

        	//Define the artifactory uploadSpec
        	uploadSpec = """{
          		"files": [
            		{
              		"pattern": "*.war",
              		"target": "${artifactoryRepo}",
              		"recursive": "true"
            		}
          		]
        	}"""

    	} else {  // regular jar case

       		//insert code to append -SNAPSHOT/RELEASE to artifact
            if ("${where2deploy}"=="edp"){
   		    	sh 'ls -al target/'
       	    	sh '''cd target/ && for file in *.jar ; do mv $file `echo $file | sed \"s/\\(.*\\).jar/\\1-'''+buildloc+'''\\.jar/\"` ; done'''
      	    	sh 'cp pom.xml target'
       	    	sh "cp pom.xml ${props.artifactoryId}-${props.appVersion}-${buildloc}.pom"
            }
			//Define the artifactory uploadSpec
        	uploadSpec = """{
          		"files": [
            		{
              		"pattern": "*.jar",
              		"target": "${artifactoryRepo}",
              		"recursive": "true"
            		},
            		{
              		"pattern": "*.pom",
              		"target": "${artifactoryRepo}",
              		"recursive": "true"
            		}
          		]
        	}"""
    	}

        println("uploadSpec: "+ uploadSpec)

        def buildInfo = Artifactory.newBuildInfo()

        // Publish build artifacts
        server.upload(uploadSpec)

        // Publish build info.
        server.publishBuildInfo buildInfo
    }
}


//-------------------------------------------------------------------------------------
// Static Analysis by SonarQube
// 1. create Sonar target project
// 2. assign specific quality gate
// 3. scan
// 4. check result if it passed
//-------------------------------------------------------------------------------------
def sonarScan(String appName, String branchType, String sqJobName){

    def sonarHostUrl = 'http://stgtlceax0015.unix.gsm1900.org:6183'

    //-------------------------------------------------------------------------------------
    //Mark the Code Analysis Stage
    stage ('SonarQube Analysis') {
        //Execute Full Scan and ship results to SonarQube
        // requires SonarQube Scanner for Maven 3.2+
    	def scannerHome = tool 'SonarQube Scanner 2.8';
    	def sonarToken = '12e9f3d6427097c39e3ee83141b9c53933ecefcd'
    	def targetProject = ''''''+appName+'''-'''+branchType+''''''

    	withSonarQubeEnv('edp-sonarqube') {
    		// requires SonarQube Scanner for Maven 3.2+
    		sh "curl -X POST https://sonarqube.service.edp.t-mobile.com/api/projects/create -F project=${targetProject} -F name=${targetProject}"

        	// select sonar quality gate for CT applications
        	sh '''curl -X POST \\
           		https://sonarqube.service.edp.t-mobile.com/api/qualitygates/select \\
          		-H \'authorization: Basic amJvdW5kczE6TWFuZ29zIzEh\' \\
          		-F gateId=2 \\
          		-F projectKey='''+targetProject+''''''

        	// execute sonar scan
        	sh "${scannerHome}/bin/sonar-scanner -Dsonar.host.url=${sonarHostUrl} -Dsonar.projectKey=${targetProject} -Dsonar.projectName=${sqJobName} -Dsonar.projectVersion=$BUILD_NUMBER -Dsonar.sources=."

        	// wait for 10 seconds to save all sonar scan report
        	sleep 10
    	}
    }

    //-------------------------------------------------------------------------------------
    //Quality Gate Stage
    /*stage("Sonar QG"){
        def qg = waitForQualityGate()
        if (qg.status != 'OK') {
            error "Pipeline aborted due to quality gate failure: ${qg.status}"
        }
    }*/
}


//-------------------------------------------------------------------------------------
// Get authonticated token to use other api call
//-------------------------------------------------------------------------------------
def getAuthenticate() {
      //-------------------------------------------------------------------------------------
      //This stage launches E2E project through httprequest passing certain parameters
      stage('Authenticating'){

        //-------------------------------------------------------------------------------------
        // Authonticating a user to execute tepExe2
        println("Authonticating a user to execute tepExe2")
        def response = httpRequest consoleLogResponseBody: true, contentType: 'APPLICATION_JSON', httpMode: 'POST', requestBody: '''{
                       "username": "user",
                       "password": "user",
                       "rememberMe": true
                     }''', responseHandle: 'NONE', url: 'https://ctexecutionplatform.apps.px-prd01.cf.t-mobile.com/api/authenticate'

        println(response)
        println("Response Content: "+response.content)

        def slurper = new JsonSlurperClassic()
        def respText = response.getContent()
        def respObject = slurper.parseText(respText)
        println("Get token : " + respObject.id_token)
        return respObject.id_token
      }
}



//-------------------------------------------------------------------------------------
// Execute E2E test
// 1. find latest version from repo
// 2. call tepExe2 to execute e2e
// 3. return tepjob name
//-------------------------------------------------------------------------------------
def runE2E(branchName, token, props) {

    stage('E2E Test'){

        println("Getting latest core version...")
        def testversion = ''
        def coreBuild = props.e2e.coreBuild
        if (!coreBuild?.trim()){
        	coreBuild = branchName
		}

        if ("${coreBuild}".startsWith('release')){
           testversion = sh returnStdout: true, script: '''server=https://artifactory.service.edp.t-mobile.com/artifactory
			                    repo=tmo-releases
                                artifactId=core_framework
                                artifact=com/tmobile/eqm/testfrwk/common/core_framework
                                path=$server/$repo/$artifact
                                version=`curl -s $path/maven-metadata.xml | grep latest | sed "s/.*<latest>\\([^<]*\\)<\\/latest>.*/\\1/"`
                                jar=$version
                                echo $jar'''
        } else {
           testversion = sh returnStdout: true, script: '''server=https://artifactory.service.edp.t-mobile.com/artifactory
			                    repo=tmo-snapshots
                                artifactId=core_framework
                                artifact=com/tmobile/eqm/testfrwk/common/core_framework
                                path=$server/$repo/$artifact
                                version=`curl -s $path/maven-metadata.xml | grep latest | sed "s/.*<latest>\\([^<]*\\)<\\/latest>.*/\\1/"`
                                build=`curl -s $path/$version/maven-metadata.xml | grep \'<value>\' | head -1 | sed "s/.*<value>\\([^<]*\\)<\\/value>.*/\\1/"`
                                jar=$build
                                echo $jar'''
        }


        println("Found CT Core Build # : " + testversion )

        def len = testversion.length() - 1;
        def ctversion = testversion.substring(0, len)

        // only for API test
        def targetEnv = props.e2e.testEnvironment
        def mavenComand = props.e2e.buildCommand
        if (!targetEnv?.trim()){
        	targetEnv = ("${env.BRANCH_NAME}".startsWith('release')) ? "prod" : "dev"
        	mavenComand = mavenComand.replaceAll("-DtargetEnv=prod", "-DtargetEnv="+targetEnv)
		}

        //calling TEP Execution API to run the 2nd QG
        println("Starting TEP Execution API call to run CT E2E project...")

       	def reqBody = '''{
                  	"codeLocation": "''' + props.e2e.codeLocation + '''",
                  	"locationType": "BITBUCKET",
                  	"bitBucketBranch": "''' + props.e2e.bitBucketBranch + '''",
                  	"buildFileLocation": "pom.xml",
                  	"buildType": "MAVEN",
                  	"buildCommand": "''' + mavenComand + '''",
                  	"testApplication": "''' + props.e2e.testApplication + '''",
                  	"testFramework": "''' + props.e2e.testFramework + '''",
                  	"autRelease": "''' + props.projectName + ' ' + props.appVersion + '''",
                  	"ctRelease" : "''' + ctversion + '''",
                  	"testEnvironment": "''' + targetEnv + '''",
                  	"testSuite": "''' + props.e2e.testSuite + '''",
                  	"executionStatus": "NEW",
                  	"submitTime":"2018-01-21T10:15:30+01:00",
                  	"isGatingEnabled": "true",
                  	"notifyEmail": "ctframeworkdev@t-mobile.com",
                  	"timeoutOverride": 60}'''


        println("Request Body: " + reqBody)

        def response = httpRequest acceptType: 'APPLICATION_JSON', contentType: 'APPLICATION_JSON', customHeaders: [[maskValue: false, name: 'Authorization', value: "Bearer $token"], [maskValue: false, name: '', value: '']], httpMode: 'POST', requestBody: reqBody, responseHandle: 'STRING', url: 'https://tepexecution2.apps.px-prd01.cf.t-mobile.com/api/executions'

        println("Status: "+response.status)
        println("Response Content: "+response.content)

        def slurper = new JsonSlurperClassic()
        def respText = response.getContent()
        def respObject = slurper.parseText(respText)
        def execId = respObject.id

        println("tepJobName:"+respObject.tepJobName)

        return execId
    }
}

def getE2ETest(baseUrl) {
echo "E2E baseURL ************************ : " + "${baseUrl}"

      stage('E2E Test'){
sh '''npm install -g webdriver-manager && npm install -g protractor && webdriver-manager update && cd e2e && protractor protractor.conf.js --baseUrl ''' + baseUrl
      }
}

//-------------------------------------------------------------------------------------
// Check E2E result
// 1. wait until job's been created on jenkins server within timeout
// 2. wait until hob's been finished on jenkins server within timeout
// 3. return result : 'SUCCESS' 'FAILURE' 'ABORTED'
//-------------------------------------------------------------------------------------
def getE2EStatus(execId, token) {

      //-------------------------------------------------------------------------------------
      stage('E2E QG'){

            def statusURL = 'https://tepexecution2.apps.px-prd01.cf.t-mobile.com/api/executions/' + execId

            def result = 'FAILURE'
            // check if jenkins has finished this job node.
            timeout(time:900, unit: 'SECONDS'){

                 waitUntil { //waits until the block returns true, used to poll every 30 seconds
                     sleep(time: 30, unit: 'SECONDS')
                     def response = httpRequest acceptType: 'APPLICATION_JSON',
					 customHeaders: [[maskValue: false, name: 'Authorization', value: "Bearer $token"], [maskValue: false, name: '', value: '']],
					 httpMode: 'GET', responseHandle: 'STRING', url: statusURL

                     println("Status: "+response.status)
                     println("Response Content: "+response.content)

                     def slurper = new JsonSlurperClassic()
                     def respText = response.getContent()
                     def respObject = slurper.parseText(respText)
					 def status = respObject.executionStatus

					 if(status == 'PASS'){
						 result = 'SUCCESS';
						 return true;
					 } else if (status == 'FAIL' || status == 'SKIP' || status == 'ERROR' || status == 'TIMEOUT'){
						 return true;
					 } else{
						 return false
					 }
			     }
            }
            return result
      }
}


//-------------------------------------------------------------------------------------
// Notify build
//-------------------------------------------------------------------------------------
def notifyBuild(buildStatus = 'STARTED', opsLead) {
  // build status of null means successful
  buildStatus =  buildStatus ?: 'SUCCESSFUL'

  // Default values
  def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
  def details = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]': Check console output at ${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]"

  if("${buildStatus}" == 'SUCCESS'){
    // Send notifications
    emailext (
            subject: subject,
            body: details,
            to: "${opsLead}",
            recipientProviders: [[$class: 'DevelopersRecipientProvider']]
    )
    //slackSend (color: '#00FF00', message: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
  }
  else if("${buildStatus}" == 'STARTED') {
    emailext (
            subject: subject,
            body: details,
            recipientProviders: [[$class: 'DevelopersRecipientProvider']]
    )
    //slackSend (color: '#FFFF00', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
  }
  else  {
    emailext (
            subject: subject,
            body: details,
            recipientProviders: [[$class: 'DevelopersRecipientProvider']]
    )
    //slackSend (color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
  }
}
